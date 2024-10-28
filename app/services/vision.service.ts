import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export interface FoodAnalysis {
    foods: Array<{
        name: string;
        calories: number;
        portion: string;
    }>;
    totalCalories: number;
}

export class VisionService {
    static async analyzeFoodImage(base64Image: string): Promise<FoodAnalysis> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Analyze this food image and provide a detailed breakdown of the foods present, their estimated portions, and calories. Return the data in a structured format."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 500
            });

            // Parse the response and structure the data
            const analysis = JSON.parse(response.choices[0].message.content);
            return {
                foods: analysis.foods,
                totalCalories: analysis.foods.reduce((sum, food) => sum + food.calories, 0)
            };
        } catch (error) {
            console.error('Error analyzing image:', error);
            throw error;
        }
    }
}