from enum import Enum
from typing import List, Optional
from pydantic import Extra, Field, root_validator, validator

from server.schemas.base import AllOptional, PyObjectId
from server.schemas.openAI import (
    ChatGPTChatCompletitionConfig,
    ChatGPTMessageTemplate,
)
from server.schemas.base import MongoBase, MyBaseModel, NameField


class PromptVersionProviders(str, Enum):
    """Currently only OpenAI is supported"""

    OPENAI = "OpenAI"


class PromptVersionStatus(str, Enum):
    DRAFT = "Draft"
    TESTING = "Testing"
    LIVE = "Live"
    ARCHIVED = "Archived"


class PromptVersionBase(MyBaseModel):
    status: PromptVersionStatus = Field(PromptVersionStatus.DRAFT)
    provider: PromptVersionProviders = Field(PromptVersionProviders.OPENAI)
    name: NameField
    description: Optional[str] = Field(None)
    prompt_id: PyObjectId
    template: ChatGPTMessageTemplate = Field(None)
    model_config: ChatGPTChatCompletitionConfig = Field(None)


class PromptVersionCreate(PromptVersionBase, extra=Extra.forbid):
    # TODO: move all validations (incl. PromptVersionPatch) to promptVersion Crud so it all at one place
    @validator("template")
    def template_must_have_at_least_one_message(cls, v):
        if v is not None and len(v) == 0:
            raise ValueError("template must have at least one message")
        return v

    @root_validator
    def nondraft_check_mandatory_fields(cls, values):
        """Check if non-Draft has all mandatory fields. on update it's checked in the endpoint code b/c previous state needs to be considered"""
        status, model_config, template = (
            values.get("status"),
            values.get("model_config"),
            values.get("template"),
        )
        if status != PromptVersionStatus.DRAFT and not (
            template and model_config and model_config.model
        ):
            raise ValueError(
                "`template` and `model_config.model` fields are mandatory for non DRAFT prompt templates."
            )
        return values


class PromptVersionInDB(PromptVersionBase, MongoBase, extra=Extra.allow):
    # list of args in the template - calculated at patch and post
    # NB: pydantic 2.0alpha has computed fields  https://github.com/pydantic/pydantic/blob/48f6842c7808807e076a69065f60a40b57f5fc5a/docs/usage/computed_fields.md#L4
    template_arg_names: Optional[List[str]] = Field([])


class PromptVersionRead(PromptVersionInDB, extra=Extra.ignore):
    pass


class PromptVersionUpdate(PromptVersionBase, metaclass=AllOptional, extra=Extra.forbid):
    # NB: some validations are in the endpoint because we don't have access to prev state here
    @validator("template")
    def template_must_have_at_least_one_message(cls, v):
        if v is not None and len(v) == 0:
            raise ValueError("template must have at least one message")
        return v
