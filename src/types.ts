export interface Program {
  id: string;
  agency: string;
  name: string;
  category: string;
  description: string;
  target_audience: string[];
  processing_time: string;
  official_url: string;
  steps: string[];
  requirements: string[];
  tags: string[];
}
