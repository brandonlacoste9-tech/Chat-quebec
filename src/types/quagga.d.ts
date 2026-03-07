declare module "quagga" {
  export interface QuaggaJSConfig {
    inputStream?: {
      name?: string;
      type?: string;
      target?: string | Element;
      constraints?: {
        width?: number | { min: number; max: number };
        height?: number | { min: number; max: number };
        facingMode?: string;
        aspectRatio?: number;
      };
      area?: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
      };
      singleChannel?: boolean;
    };
    locate?: boolean;
    numOfWorkers?: number;
    frequency?: number;
    decoder?: {
      readers?: string[];
      debug?: {
        drawBoundingBox?: boolean;
        showFrequency?: boolean;
        drawScanline?: boolean;
        showPattern?: boolean;
      };
      multiple?: boolean;
    };
    locator?: {
      halfSample?: boolean;
      patchSize?: string;
      debug?: {
        showCanvas?: boolean;
        showPatches?: boolean;
        showFoundPatches?: boolean;
        showSkeleton?: boolean;
        showLabels?: boolean;
        showPatchLabels?: boolean;
        showRemainingPatchLabels?: boolean;
        boxFromPatches?: {
          showTransformed?: boolean;
          showTransformedBox?: boolean;
          showBB?: boolean;
        };
      };
    };
    debug?: boolean;
  }

  export interface QuaggaJSResult {
    codeResult: {
      code: string;
      format: string;
      start: number;
      end: number;
      codeset: number;
      startHex: string;
      endHex: string;
      decodedCodes: any[];
    };
    line: { x: number; y: number }[];
    angle: number;
    pattern: number[];
    box: any[];
    boxes: any[];
  }

  export function init(
    config: QuaggaJSConfig,
    callback?: (err: Error | null) => void,
  ): void;
  export function start(): void;
  export function stop(): void;
  export function onDetected(callback: (result: QuaggaJSResult) => void): void;
  export function offDetected(callback: (result: QuaggaJSResult) => void): void;
  export function onProcessed(callback: (result: any) => void): void;
  export function offProcessed(callback: (result: any) => void): void;
  export function setStep(step: number): void;
  export function registerReader(name: string, reader: any): void;
  export function decodeSingle(
    config: QuaggaJSConfig,
    callback: (result: QuaggaJSResult) => void,
  ): void;

  const Quagga: {
    init: typeof init;
    start: typeof start;
    stop: typeof stop;
    onDetected: typeof onDetected;
    offDetected: typeof offDetected;
    onProcessed: typeof onProcessed;
    offProcessed: typeof offProcessed;
    setStep: typeof setStep;
    registerReader: typeof registerReader;
    decodeSingle: typeof decodeSingle;
    CameraAccess: any;
    ImageDebug: any;
    ImageWrapper: any;
    ResultCollector: any;
  };

  export default Quagga;
}
