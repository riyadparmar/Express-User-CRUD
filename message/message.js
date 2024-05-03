const oMessage = {
    sUserExists: { error: 'Email already exists' },
    sUserNotFound: { error: 'User not found' },
    sInternalServerError: { error: 'Internal server error' },
    sMandatoryFields: { error: 'Missing required fields: name, password, and email are required.' },
    sEmailNotValid: { error: 'Invalid email format.' },
    sLoginSuccess: { message: 'Login successful!' },
    sInvalidCredentials: { error: 'Invalid credentials' },
    sIncorrectPassword: { message: "Incorrect password" },
    sForbiddenAccess: { error: 'Access forbidden: requires admin role' },
}

module.exports = oMessage;