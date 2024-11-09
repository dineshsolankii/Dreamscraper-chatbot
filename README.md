# Dreamscraper-chatbot

This Flask application integrates **Google Gemini** for natural language processing, **Stable Diffusion** for image generation, and **Google Text-to-Speech (gTTS)** for audio. It allows users to engage in an interactive storytelling experience by providing a dynamic text-based narrative, an illustrative image, and an audio narration.

## Components and Dependencies

- **Flask**: Web framework to handle HTTP requests and render HTML.
- **torch**: For handling operations on tensors, enabling compatibility with Stable Diffusion models.
- **gTTS (Google Text-to-Speech)**: For generating audio files from text.
- **Stable Diffusion**: An image generation model used to create images based on narrative summaries.
- **Google Gemini (LangChain)**: A language model to generate interactive story content.

## Environment Variables

- `GOOGLE_API_KEY`: API key for Google Gemini model.
- `HF_TOKEN`: Hugging Face API token to access Stable Diffusion.

## Code Breakdown

### Initialization

- **API Key Setup**: `GOOGLE_API_KEY` and `HF_TOKEN` are set as environment variables for Google Gemini and Hugging Face, respectively.
- **Google Gemini LLM Initialization**: `ChatGoogleGenerativeAI` is configured with parameters like model, temperature, and timeout to generate responses that are engaging and contextually relevant.
- **Stable Diffusion Model Initialization**: Loads the `StableDiffusionPipeline` using Hugging Face's token for authentication and optimizes it for either CUDA (if available) or CPU.

### Global Variables

- **Memory**: Maintains conversation history for continuity in responses.
- **Style Context**: Stores genre and related details to ensure consistency in storytelling style.

### Helper Functions

- **`generate_image(prompt)`**:
    - Takes a prompt generated by the language model, generates an image using Stable Diffusion, resizes it to 400x400 pixels, and saves it as `story_image.png`.

- **`generate_audio(text)`**:
    - Converts the input text to speech using gTTS and saves the output as `audio_output.mp3`.

- **`generate_image_summary(story)`**:
    - Uses Google Gemini to create a 50-word summary specifically for generating an image.

- **`process_input(user_input)`**:
    - If this is the first input, it initializes the conversation with the model and saves the response.
    - For subsequent inputs, it retrieves the full conversation context, invokes the language model, and appends new responses to the memory list.

### Routes

- **`/`**: The home route renders the `index.html` template.
- **`/generate` (POST)**: Handles the main storytelling logic:
    - Takes `user`, `genre`, `tone`, `characters`, `skills`, and `related` as input parameters to shape the story.
    - Constructs the initial storytelling prompt to set up the scene, character, and tone.
    - Uses `process_input()` to get the next part of the story, formats actions and options, and generates image and audio based on the story context.
    - Returns the generated story text, image path, and audio path as JSON.

## Run the Application

The app runs in Flask’s debug mode for easy troubleshooting.

