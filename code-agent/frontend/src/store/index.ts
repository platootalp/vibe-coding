import { create } from 'zustand';

interface CodeState {
  code: string;
  language: string;
  filename: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setFilename: (filename: string) => void;
}

export const useCodeStore = create<CodeState>((set) => ({
  code: '',
  language: 'python',
  filename: '',
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setFilename: (filename) => set({ filename }),
}));

interface AnalysisState {
  result: any;
  loading: boolean;
  error: string | null;
  setResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  result: null,
  loading: false,
  error: null,
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

interface GenerationState {
  result: any;
  loading: boolean;
  error: string | null;
  setResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  result: null,
  loading: false,
  error: null,
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

interface OptimizationState {
  result: any;
  loading: boolean;
  error: string | null;
  setResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOptimizationStore = create<OptimizationState>((set) => ({
  result: null,
  loading: false,
  error: null,
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
