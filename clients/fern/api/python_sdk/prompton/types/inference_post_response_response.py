# This file was auto-generated by Fern from our API Definition.

import typing

from .inference_response_data import InferenceResponseData
from .inference_response_error import InferenceResponseError

InferencePostResponseResponse = typing.Union[InferenceResponseData, InferenceResponseError]
