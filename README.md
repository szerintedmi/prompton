# PromptOn - Chat prompt template evaluation and inference monitoring

Testing and evaluating prompts for real world use is challenging.

Completitions are not determinstic and quality is unpredictable with all potential variables, especially with more complex prompts.

**Prompt A:**
> **Assistant:** You are Tyrion Lannister, known for your sharp wit and frequent sarcasm in Game of Thrones. Answer all questions with a maximum of `${words_limit}` words
>
> **User:** Tell me, am I `${what]`?

**Prompt B:**

> Assistant: You are Marvin, the paranoid android from Hitchhiker's Guide to the Galaxy. Answer all questions with a maximum of `${words_limit}` words.
>
> User: Tell me, am I `${what]`?

- Answers from which prompt do users like more?
- Should I use `gpt-4`, `gpt-3-turbo`, or is a free open-source model enough?
- What's the ideal temperature setting?
- Do all user-submitted `${what}` values play nicely?

## Concept

PromptOn helps you to:

- Evaluate your prompt template tweaks in-house
- A/B test versions with end users
- Continuosly monitor feedback
- And it doubles as your all-in-one log and monitor for your model calls

It's a REST API microservice designed to mix it into your existing ecosystem in a non intrusive way.

## Getting started

 The easiest way to try is via the [Prompton API documentation UI](https://staging.api.prompton.ai) on our hosted staging environment.

 There is no public signup currently but drop an email for early access: <hello@prompton.ai>

 You can also try in local dev env: [Local setup](#local-dev-setup)

The API is still in alpha, may change without notice. However, the schema is largely stable and it will soon enter production when  proper versioning will be introduced.

### End-to-end example

1. User Auth

    Prompton users are those who handle prompts and the services that call inferences on behalf of the final users.

    User auth is via JWT tokens. Once you have a user/password just click on authorize on [Prompton API documentation UI](https://staging.api.prompton.ai).

    From code you can use `/token` endpoint.

    OrgAdmins can add more users to their org via the `/users` endpoint.

    NB: All users in your org can create and change prompts and call inferences using your org API keys but only OrgAdmins can add new users or change the org settings.

1. OpenAI API key

    Once you authenticated you need to assign an `openai_api_key` to your org:

    - GET your `org_id` via `orgs/me`

    - Set your `openai_api_key` using `/orgs` PATCH:

        ```json
        { "access_keys": {"openai_api_key": "<your OpenAI API key>"  }}
        ```

    TIP: if you just want to play around then set `openai_api_key` to any string and [mock responses](#mock-response-tip)

1. Prompt

    Prompts are your use-cases, "headers" for your different prompt template variants. Create one via `/prompts`

1. Prompt version

    Prompt version is the actual `template` with the `mode_config` and `template` to be used when the provider is called (`inference`)

    Example prompt version with basic params:

    ```json
     {
        "status": "Live",
        "provider": "OpenAI",
        "name": "Test template",
        "prompt_id": "<your prompt_id>",
        "template": [
            {
                "role": "system",
                "content": "You are a sarcastic assistant. Answer all questions with maximum ${words_limit} words"
            },
            {"role": "user", "content": "Tell me, am I ${what}"}
        ],
        "model_config": {"model": "gpt-3.5-turbo", "temperature": 1, "max_tokens": 500}
    }    
    ```

    NB: Only `Draft` status promptVersions can be updated (apart from changing the status to any non-Draft).  It's to make sure inferences are comparable. If you need to change a prompt version then create a new one. Copy a prompt version is on the todo but until then it can to be handled by an UI.

1. Inference - aka calling the model: POST `/inferences`

    ```json
    {
        "prompt_version_id": "<your prompt version id>",
        "end_user_id": "your_end_user_id_for_linking", 
        "source": "swaggerdocs", 
        "template_args": {"words_limit": "10", "what": "crazy"}
    }
    ```

    It will:
    1. Populate the template with the passed values
    1. Log the request
    1. Send the request to provider
    1. Log respnse and send it back to client.

    It also handles errors, timeouts and updates the inference accordingly. It will still process response if client disconnects before it arrives.

    Tip:<a name="mock-response-tip"></a> you can use a few easter eggs to test it without a valid api key. You can pass these values in `end_user_id` to mock responses:

    - `mock_me_softly`
    - `timeout_me_softly`
    - `fail_me_softly`

    Example sucessfull response (NB: full raw request data also accessible via `/inference` GET):

    ```json
    {
        "id": "648230b9cdd2a95d2190ed23",
        "response": {
            "completed_at": "2023-06-08T19:49:15.293824",
            "completition_duration_seconds": 1.6043,
            "is_client_connected_at_finish": true,
            "isError": false,
            "first_message": {
                "role": "assistant",
                "content": "Not in any legally diagnosable manner.",
                "name": null,
            },
            "token_usage": {
                "prompt_tokens": 34,
                "completion_tokens": 9,
                "total_tokens": 43,
            },
            "raw_response": {
                "id": "chatcmpl-7PFv8dtMhnin1o8bxSnlRs6IUwLSS",
                "object": "chat.completion",
                "created": 1686253754,
                "model": "gpt-3.5-turbo-0301",
                "usage": {"prompt_tokens": 34, "completion_tokens": 9, "total_tokens": 43},
                "choices": [
                    {
                        "message": {
                            "role": "assistant",
                            "content": "Not in any legally diagnosable manner.",
                            "name": null,
                        },
                        "finish_reason": "stop",
                        "index": 0,
                    }
                ],
            },
        },
    }
    ```

1. Query inferences: see `/inferences` GET endpoint

    Currently only filter by `prompt_id` and `prompt_version_id` supported. Let us know what else you need.

1. Response feedback and flagging

     Stay tuned: Support for end user feedback (following an inference) and optional external feedback (i.e.expert feedback/flagging etc.) is coming.

## Local dev setup

1. install packages with poetry

    `poetry install`

    `poetry shell` - instructions below assuming you are in the shell

1. Create your local `.env`  
    see: [.env.example](.env.example)

1. Launch MongDB

    A. Locally in the provided container:

    `docker compose -f ./docker-compose-dev.yml up`

    Container provides:

    - MongoDB instance on `localhost:27017` with the username/password set in your `.env`

      It stores data in `.mongo-data` folder. DB is initialised with scripts in [mongo-init-docker-dev](./mongo-init-docker-dev) folder at first run.

      Remove containter:

        `docker compose -f ./docker-compose-dev.yml down`

      Re-initialise DB

      If you need an empty DB db again then delete `.mongo-data` folder and next startup will initialize again.

    - Mongo Express on <http://localhost:8081>

   B. Connect to any instance by setting env vars in `.env`

1. Run the server

    ```sh
    uvicorn server.asgi:app --reload
    ```

   Running server in container if you need to test the container or you want to deploy it yourself:

    ```sh
    docker build -t prompton-api-server:dev .
    docker run --env-file .env -it -p 8080:8080 prompton-api-server:dev
    ```

### Tests

```sh
pytest
```

```sh
pytest -m "not slow"` # if you want to cut a few secs by avoiding slower tests (password hasing etc.)
```

### Initialising a blank remote MongoDB database

1. Set your `.env` based on [.env.example](.env.example)

1. Optional: if you only have admin role db user create one for the api with only readWrite acces. Manually or use this script:

    ```sh
    poetry run python -m scripts.db_init_add_api_user
    ```

1. Create initial org and SuperAdmin user

    ```sh
    poetry run python -m scripts.db_init_indexes_and_first_user
    ```

## Licence

This project is licensed under the GNU Affero General Public License v3.0 license - see the [LICENSE](LICENSE) file for details.
