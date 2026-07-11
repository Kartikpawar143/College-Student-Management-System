# Basic placeholder for auth utilities
def verify_role(user, required_role):
    return user.get("role") == required_role
