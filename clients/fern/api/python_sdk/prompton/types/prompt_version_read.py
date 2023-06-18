# This file was auto-generated by Fern from our API Definition.

import datetime as dt
import typing

import pydantic

from ..core.datetime_utils import serialize_datetime
from .chat_gpt_chat_completition_config import ChatGptChatCompletitionConfig
from .chat_gpt_message import ChatGptMessage
from .prompt_version_providers import PromptVersionProviders
from .prompt_version_status import PromptVersionStatus


class PromptVersionRead(pydantic.BaseModel):
    """
    Base model for reading from MongoDB. Same as MongoBaseCreate but assumes all DB base fields are populated so generated clients doesn't requrie None checks
    """

    id: str = pydantic.Field(alias="_id")
    created_at: str
    created_by_user_id: str
    created_by_org_id: str
    status: PromptVersionStatus
    provider: PromptVersionProviders
    name: str = pydantic.Field(description=('<span style="white-space: nowrap">`non-empty`</span>\n'))
    description: typing.Optional[str]
    prompt_id: str
    template: typing.List[ChatGptMessage]
    model_config: typing.Optional[ChatGptChatCompletitionConfig]
    template_arg_names: typing.List[str] = pydantic.Field(
        description=("List of args in the template - populated by server at PATHC and POST\n")
    )

    def json(self, **kwargs: typing.Any) -> str:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().json(**kwargs_with_defaults)

    def dict(self, **kwargs: typing.Any) -> typing.Dict[str, typing.Any]:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().dict(**kwargs_with_defaults)

    class Config:
        frozen = True
        allow_population_by_field_name = True
        json_encoders = {dt.datetime: serialize_datetime}
