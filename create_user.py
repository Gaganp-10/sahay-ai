from streamlit_authenticator.utilities.hasher import Hasher
from app.services.auth_service import auth

hashed_password = Hasher.hash("1234")

success = auth.register_user(
    username="admin",
    name="Admin",
    password=hashed_password
)

print(success)