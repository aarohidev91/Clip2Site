export interface GeneratedContent {
  brandName: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  problem: {
    title: string;
    points: string[];
  };
  solution: {
    title: string;
    description: string;
  };
  benefits: Array<{ title: string; description: string }>;
  features: Array<{ title: string; description: string }>;
  socialProof: {
    title: string;
    items: string[];
  };
  pricing: {
    title: string;
    description: string;
    price: string;
    features: string[];
  };
  faqs: Array<{ question: string; answer: string }>;
  finalCta: {
    title: string;
    description: string;
    button: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface ProviderStatus {
  configured_provider: string;
  gemini_available: boolean;
  gemini_model: string;
  active_provider: string;
}

export interface GenerationResponse {
  status: string;
  ai_provider_used: string;
  generated_content: GeneratedContent;
  generation_error: string;
}

export interface ExportResponse {
  content: string;
  filename: string;
  content_type: string;
}
