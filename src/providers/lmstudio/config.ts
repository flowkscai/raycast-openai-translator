import { IConfig, IModel } from "../types";

const config: IConfig = {
  requireModel: true,
  defaultModel: {
    id: "llama2",
    name: "Llama 2",
  },
  supportCustomModel: true,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async listModels(apikey: string | undefined, entrypoint: string | undefined): Promise<IModel[]> {
    let result: IModel[] = [];

    if (entrypoint && entrypoint !== "") {
      const url = entrypoint.replace("/chat/completions", "/models");
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apikey}`,
          },
        });
        if (!response.ok) {
          console.error(`API request failed with status ${response.status}`);
        }
        const res = (await response.json()) as { data: { id: string }[] };
        // check gpt inside the model list
        result = res.data.map((model) => ({
          name: model.id,
          id: model.id,
        }));
        return result;
      } catch (error) {
        console.error("Failed to fetch model list from API, using fallback models:", error);
      }
    }

    return Promise.resolve(result);
  },
  defaultEntrypoint: "http://localhost:1234/v1/chat/completions",
  supportCustomEntrypoint: true,
  requireApiKey: false,
  hasApiKey: false,
};

export default config;
