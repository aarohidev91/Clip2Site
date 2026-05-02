from app.core.security import create_access_token, decode_access_token, hash_password, verify_password


def test_password_hashing():
    password = "secure_password_123"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_jwt_token():
    user_id = "test_user_123"
    token = create_access_token(user_id)
    decoded_id = decode_access_token(token)
    assert decoded_id == user_id
