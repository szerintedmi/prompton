from tests.endpoints.users.user_get_test_spec import (
    test_db_data,
    test_specs_get,
)

from tests.endpoints.test_generators.get_test_genarator import (
    generate_pytest_get,
    generate_pytest_get_empty,
)
from tests.shared_test_data import USER_SUPER_ADMIN


test_users_get = generate_pytest_get("/users", test_db_data, test_specs_get)

test_users_get_empty = generate_pytest_get_empty(
    "/users", mock_users=[USER_SUPER_ADMIN]
)
