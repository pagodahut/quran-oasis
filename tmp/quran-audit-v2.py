#!/usr/bin/env python3
"""
Quran Text Integrity Audit v2
Cross-references local complete_quran.json against:
  1. Al Quran Cloud API (original source, quran-uthmani) — must be exact
  2. quran.com API v4 (text_uthmani) — normalized comparison (tatweel variants)
Also validates: verse counts, bismillah handling, BOM consistency
"""

import json
import urllib.request
import unicodedata
import time
import sys
import re

LOCAL_PATH = "/Users/admin/quran-oasis/src/data/complete_quran.json"
REPORT_PATH = "/Users/admin/quran-oasis/tmp/audit-report.json"

def nfc(text):
    return unicodedata.normalize("NFC", text.strip().lstrip('\ufeff'))

def normalize_uthmani(text):
    """Normalize known Uthmani variants for comparison:
    - Remove tatweel (kashida U+0640) — cosmetic extender
    - Remove BOM
    - NFC normalize
    """
    t = text.strip().lstrip('\ufeff')
    t = t.replace('\u0640', '')  # remove tatweel
    return unicodedata.normalize("NFC", t)

def strip_all_marks(text):
    """Remove all diacritics/combining marks for skeleton comparison"""
    t = text.replace('\u0640', '').lstrip('\ufeff')
    nfkd = unicodedata.normalize("NFKD", t)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).strip()

def fetch_json(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={
                "Accept": "application/json",
                "User-Agent": "QuranAudit/1.0"
            })
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read())
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
            else:
                print(f"    FETCH FAILED: {e}", file=sys.stderr)
                return None

def main():
    with open(LOCAL_PATH) as f:
        local = json.load(f)

    report = {
        "summary": {},
        "exact_source_mismatches": [],   # vs alquran.cloud (should be 0)
        "qurancom_text_diffs": [],       # vs quran.com after normalization
        "verse_count_issues": [],
        "bismillah_issues": [],
        "bom_issues": [],
        "tatweel_diffs": [],             # expected cosmetic diffs vs quran.com
    }

    # Stats
    total_checked = 0
    source_mismatches = 0
    qcom_real_diffs = 0
    tatweel_only = 0
    surahs_source_clean = 0

    for local_surah in local["surahs"]:
        snum = local_surah["number"]
        sname = local_surah.get("englishName", f"Surah {snum}")
        local_ayahs = local_surah["ayahs"]
        local_count = len(local_ayahs)

        print(f"[{snum:3d}/114] {sname} ({local_count})...", end=" ", flush=True)

        # === SOURCE CHECK: Al Quran Cloud (must be exact) ===
        cloud_data = fetch_json(f"https://api.alquran.cloud/v1/surah/{snum}/quran-uthmani")
        cloud_ayahs = cloud_data["data"]["ayahs"] if cloud_data and cloud_data.get("status") == "OK" else None
        time.sleep(0.15)

        # === CROSS-REF: quran.com ===
        qcom_all = []
        page = 1
        while True:
            qd = fetch_json(f"https://api.quran.com/api/v4/verses/by_chapter/{snum}?fields=text_uthmani&per_page=50&page={page}")
            if not qd:
                break
            qcom_all.extend(qd.get("verses", []))
            if page >= qd.get("pagination", {}).get("total_pages", 1):
                break
            page += 1
            time.sleep(0.15)
        time.sleep(0.1)

        surah_source_ok = True
        surah_issues = []

        # Verse counts
        if cloud_ayahs and len(cloud_ayahs) != local_count:
            report["verse_count_issues"].append({
                "surah": snum, "name": sname, "source": "alquran.cloud",
                "local": local_count, "api": len(cloud_ayahs)})
            surah_source_ok = False

        if qcom_all and len(qcom_all) != local_count:
            report["verse_count_issues"].append({
                "surah": snum, "name": sname, "source": "quran.com",
                "local": local_count, "api": len(qcom_all)})

        # Per-ayah comparison
        for i in range(local_count):
            local_arabic = local_ayahs[i].get("text", {}).get("arabic", "")
            ayah_num = local_ayahs[i].get("numberInSurah", i + 1)
            total_checked += 1

            # BOM check
            if i > 0 and '\ufeff' in local_arabic:
                report["bom_issues"].append({
                    "surah": snum, "ayah": ayah_num,
                    "note": "Unexpected BOM in non-first ayah"})

            # Source comparison (exact after NFC + BOM strip)
            if cloud_ayahs and i < len(cloud_ayahs):
                l = nfc(local_arabic)
                c = nfc(cloud_ayahs[i].get("text", ""))
                if l != c:
                    source_mismatches += 1
                    surah_source_ok = False
                    report["exact_source_mismatches"].append({
                        "surah": snum, "ayah": ayah_num, "verse_key": f"{snum}:{ayah_num}",
                        "severity": "CRITICAL",
                        "local": local_arabic[:120], "source": cloud_ayahs[i]["text"][:120]})

            # quran.com comparison (normalized — tatweel-tolerant)
            if qcom_all and i < len(qcom_all):
                qtext = qcom_all[i].get("text_uthmani", "")
                l_norm = normalize_uthmani(local_arabic)
                q_norm = normalize_uthmani(qtext)

                if l_norm != q_norm:
                    # Real difference after normalization
                    qcom_real_diffs += 1
                    report["qurancom_text_diffs"].append({
                        "surah": snum, "ayah": ayah_num, "verse_key": f"{snum}:{ayah_num}",
                        "local_norm": l_norm[:120], "qcom_norm": q_norm[:120]})
                elif nfc(local_arabic) != nfc(qtext):
                    # Tatweel-only diff (cosmetic, expected)
                    tatweel_only += 1

        # Bismillah checks
        if local_count > 0:
            first = nfc(local_ayahs[0].get("text", {}).get("arabic", ""))
            has_bismillah = "بسم" in strip_all_marks(first)

            if snum == 9 and has_bismillah:
                report["bismillah_issues"].append({
                    "surah": 9, "severity": "CRITICAL",
                    "note": "At-Tawba must NOT have Bismillah"})
            if snum == 1 and not has_bismillah:
                report["bismillah_issues"].append({
                    "surah": 1, "severity": "CRITICAL",
                    "note": "Al-Fatiha verse 1 must be Bismillah"})

        if surah_source_ok:
            surahs_source_clean += 1
            status = "✅"
        else:
            status = "🔴"

        # Add quran.com info
        qcom_diffs_this = sum(1 for x in report["qurancom_text_diffs"] if x["surah"] == snum)
        if qcom_diffs_this:
            status += f" ({qcom_diffs_this} qcom diffs)"

        print(status)

    report["summary"] = {
        "total_surahs": 114,
        "total_ayahs_checked": total_checked,
        "surahs_exact_match_source": surahs_source_clean,
        "source_mismatches_CRITICAL": source_mismatches,
        "qurancom_real_diffs_after_normalization": qcom_real_diffs,
        "qurancom_tatweel_only_diffs": tatweel_only,
        "verse_count_issues": len(report["verse_count_issues"]),
        "bismillah_issues": len(report["bismillah_issues"]),
        "bom_issues": len(report["bom_issues"]),
    }

    with open(REPORT_PATH, "w") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}")
    print(f"QURAN TEXT INTEGRITY AUDIT v2 — COMPLETE")
    print(f"{'='*60}")
    print(f"Ayahs checked:                    {total_checked}")
    print(f"")
    print(f"=== SOURCE INTEGRITY (vs alquran.cloud) ===")
    print(f"Surahs exact match:               {surahs_source_clean}/114")
    print(f"Source mismatches (CRITICAL):      {source_mismatches}")
    print(f"")
    print(f"=== CROSS-REFERENCE (vs quran.com) ===")
    print(f"Real diffs after normalization:    {qcom_real_diffs}")
    print(f"Tatweel-only diffs (cosmetic):     {tatweel_only}")
    print(f"")
    print(f"=== STRUCTURAL ===")
    print(f"Verse count issues:               {len(report['verse_count_issues'])}")
    print(f"Bismillah issues:                 {len(report['bismillah_issues'])}")
    print(f"BOM issues:                       {len(report['bom_issues'])}")
    print(f"\nReport: {REPORT_PATH}")

if __name__ == "__main__":
    main()
