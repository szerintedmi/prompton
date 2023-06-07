from typing import List, Annotated
from fastapi import APIRouter, Depends, status

from server.core.database import get_db
from server.endpoints.endpoint_exceptions import PermissionValidationError
from server.schemas.user import UserInDB, UserRoles
from server.core.user import (
    get_current_active_user,
    get_current_org_admin_user,
    get_current_super_user,
)
from server.endpoints.ApiResponses import ReqResponses
from server.schemas.org import OrgCreate, OrgRead, OrgUpdate
from server.crud.org import org_crud

router = APIRouter()


@router.get("/orgs", tags=["orgs"], response_model=List[OrgRead])
async def get_org_list(
    current_user: Annotated[UserInDB, Depends(get_current_super_user)],
    db=Depends(get_db),
):
    res = await org_crud.get_multi(db, current_user=current_user)
    return res


@router.get(
    "/orgs/me",
    tags=["orgs"],
    response_model=OrgRead,
    responses={**ReqResponses.INVALID_ITEM_ID},
)
async def get_current_user_org(
    id: str,
    current_user: Annotated[UserInDB, Depends(get_current_active_user)],
    db=Depends(get_db),
):
    return await org_crud.get(db, current_user.id, current_user)


@router.get(
    "/orgs/{id}",
    tags=["orgs"],
    response_model=OrgRead,
    responses={**ReqResponses.INVALID_ITEM_ID},
)
async def get_org_by_id(
    id: str,
    current_user: Annotated[UserInDB, Depends(get_current_active_user)],
    db=Depends(get_db),
):
    # TODO: hide access_keys.key values
    return await org_crud.get(db, id, current_user)


@router.post(
    "/orgs",
    tags=["orgs"],
    status_code=status.HTTP_201_CREATED,
    responses={**ReqResponses.POST_CREATED},
)
async def add_org(
    org: OrgCreate,
    current_user: Annotated[UserInDB, Depends(get_current_super_user)],
    db=Depends(get_db),
):
    insert_res = await org_crud.create(db, current_user=current_user, obj_in=org)

    return {"id": str(insert_res.inserted_id)}


@router.patch(
    "/orgs/{id}",
    tags=["orgs"],
    response_model=OrgRead,
    responses={**ReqResponses.INVALID_ITEM_ID, **ReqResponses.PATH_UPDATED},
)
async def update_org(
    org_patch: OrgUpdate,
    id: str,
    current_user: Annotated[UserInDB, Depends(get_current_org_admin_user)],
    db=Depends(get_db),
):
    if current_user.role != UserRoles.SUPER_ADMIN and id != str(current_user.org_id):
        raise PermissionValidationError(
            f"Not allowed to update org_id `{id}`. Only items belonging to user's org can be updated "
        )
    current_org = await org_crud.get(db, id, current_user)
    if current_org.access_keys and org_patch.access_keys:
        org_patch.access_keys = {**current_org.access_keys, **org_patch.access_keys}

    org = await org_crud.update_and_fetch(db, id, org_patch, current_user)

    return org
