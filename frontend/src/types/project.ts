import type { GeneratedContent } from './generation';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_audience: string;
  desired_tone: string;
  original_video_filename: string;
  video_path: string;
  transcript: string;
  analysis: Record<string, unknown>;
  generated_content: GeneratedContent;
  selected_template: string;
  ai_provider_used: string;
  generation_error: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'draft' | 'uploaded' | 'transcribing' | 'analyzing' | 'generated' | 'failed';

export interface CreateProjectData {
  title: string;
  description: string;
  target_audience: string;
  desired_tone: string;
}
