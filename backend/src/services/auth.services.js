const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { mySqlDataSource } = require('../config/appDataSource');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    hashToken,
} = require('../utils/token.util');

const accountRepository = () => mySqlDataSource.getRepository('Accounts');
const BCRYPT_ROUNDS = 12;
const DUMMY_PASSWORD_HASH = '$2b$12$CwTycUXWue0Thq9StjUM0uJ8R.OAie1kW9m2BRpgJ.8Mcixuqx3dC';

const normalizeEmail = (email) => email.trim().toLowerCase();

const isSameTokenHash = (left, right) => {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return leftBuffer.length === rightBuffer.length
        && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const toAccountResponse = (account) => ({
    id: account.id,
    fullname: account.fullname,
    email: account.email,
    role: account.role,
    createdAt: account.createdAt,
});

const createAuthTokens = async (account) => {
    const payload = {
        id: account.id,
        email: account.email,
        role: account.role,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await accountRepository().update(account.id, {
        refreshTokenHash: hashToken(refreshToken),
    });

    return {
        accessToken,
        refreshToken,
    };
};

const register = async ({ fullname, email, password }) => {
    const repo = accountRepository();
    const normalizedEmail = normalizeEmail(email);
    const existedAccount = await repo.findOne({
        where: { email: normalizedEmail },
        select: ['id'],
    });

    if (existedAccount) {
        const error = new Error('Email da duoc su dung');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const account = repo.create({
        fullname,
        email: normalizedEmail,
        password: hashedPassword,
    });

    const savedAccount = await repo.save(account);
    const tokens = await createAuthTokens(savedAccount);

    return {
        account: toAccountResponse(savedAccount),
        ...tokens,
    };
};

const login = async ({ email, password }) => {
    const repo = accountRepository();
    const normalizedEmail = normalizeEmail(email);
    const account = await repo.findOne({
        where: { email: normalizedEmail },
    });

    if (!account) {
        await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
        const error = new Error('Email hoac mat khau khong dung');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
        const error = new Error('Email hoac mat khau khong dung');
        error.statusCode = 401;
        throw error;
    }

    const tokens = await createAuthTokens(account);

    return {
        account: toAccountResponse(account),
        ...tokens,
    };
};

const refreshToken = async ({ refreshToken: currentRefreshToken }) => {
    if (!currentRefreshToken) {
        const error = new Error('Refresh token la bat buoc');
        error.statusCode = 400;
        throw error;
    }

    let decoded;

    try {
        decoded = verifyRefreshToken(currentRefreshToken);
    } catch (error) {
        const invalidTokenError = new Error('Refresh token khong hop le hoac da het han');
        invalidTokenError.statusCode = 401;
        throw invalidTokenError;
    }

    const repo = accountRepository();
    const account = await repo.findOne({
        where: { id: decoded.id },
    });

    if (!account || !account.refreshTokenHash) {
        const error = new Error('Refresh token khong hop le');
        error.statusCode = 401;
        throw error;
    }

    const hashedCurrentRefreshToken = hashToken(currentRefreshToken);

    if (!isSameTokenHash(hashedCurrentRefreshToken, account.refreshTokenHash)) {
        const error = new Error('Refresh token khong dung');
        error.statusCode = 401;
        throw error;
    }

    const tokens = await createAuthTokens(account);

    return {
        account: toAccountResponse(account),
        ...tokens,
    };
};

const logout = async ({ accountId }) => {
    const repo = accountRepository();
    const account = await repo.findOne({
        where: { id: accountId },
        select: ['id'],
    });

    if (!account) {
        const error = new Error('Tai khoan khong ton tai');
        error.statusCode = 404;
        throw error;
    }

    await repo.update(accountId, {
        refreshTokenHash: null,
    });

    return true;
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
};
