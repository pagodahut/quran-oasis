declare module '@xenova/transformers' {
  export function pipeline(
    task: string,
    model: string,
    options?: {
      progress_callback?: (data: any) => void;
      quantized?: boolean;
    }
  ): Promise<any>;
  
  export const env: {
    allowLocalModels: boolean;
    useBrowserCache: boolean;
    backends: {
      onnx: {
        wasm: {
          proxy: boolean;
        };
      };
    };
  };
}
