module.exports = {
    STATUS_SUCCESS: 'SUCCESS',
    STATUS_SUCCESS_MESSAGE: 'Sukses',
    STATUS_SUCCESS_LOGIN_MESSAGE: 'Anda telah berhasil masuk',
    STATUS_SUCCESS_LOGOUT_MESSAGE: 'Anda telah berhasil keluar',
    STATUS_SUCCESS_UPDATE_PROFILE: 'Anda telah berhasil merubah data diri anda',
    STATUS_FAILED: 'FAILED',
    STATUS_FAILED_MESSAGE: 'Failed',

    STATUS_USER_ALREADY_VERIFIED: 'ALREADY_VERIFIED',
    STATUS_USER_ALREADY_VERIFIED_MESSAGE: 'Akun sudah terverifikasi. Silakan login.',

    STATUS_USER_ALREADY_EXIST: 'ALREADY_EXIST',
    STATUS_USER_ALREADY_EXIST_MESSAGE: 'Akun sudah ada',
    STATUS_USER_EMAIL_ALREADY_EXIST: 'The {PATH} already used',

    STATUS_USER_PASSWORD_NOT_FOUND: 'USER_PASSWORD_NOT_FOUND',
    STATUS_USER_PASSWORD_NOT_FOUND_MESSAGE: 'Kombinasi nama pengguna atau kata kunci salah',

    STATUS_USER_DOES_NOT_EXIST: 'USER_DOES_NOT_EXIST',
    STATUS_USER_DOES_NOT_EXIST_MESSAGE: 'Nama pengguna tidak ada',

    STATUS_USER_NOT_VERIFIED: 'USER_NOT_VERIFIED',
    STATUS_USER_NOT_VERIFIED_MESSAGE: 'Akun belum terverifikasi',

    STATUS_WRONG_USERNAME_OR_PASSWORD: 'WRONG_USERNAME_OR_PASSWORD',
    STATUS_WRONG_USERNAME_OR_PASSWORD_MESSAGE: 'Kombinasi nama pengguna atau kata kunci salah',

    STATUS_INACTIVE_USER: 'INACTIVE_USER',
    STATUS_INACTIVE_USER_MESSAGE: 'Akun belum aktif',

    STATUS_UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    STATUS_UNKNOWN_ERROR_MESSAGE: 'Kesalahan yang tidak diketahui',

    STATUS_ALREADY_VERIFIED: 'ALREADY_VERIFIED',
    STATUS_ALREADY_VERIFIED_MESSAGE: 'Akun telah terverifikasi',

    STATUS_ALREADY_LINKED: 'ALREADY_LINKED',
    STATUS_ALREADY_LINKED_MESSAGE: 'Sudah terhubung',

    STATUS_TOKEN_ALREADY_SENT: 'TOKEN_ALREADY_SENT',
    STATUS_TOKEN_ALREADY_SENT_MESSAGE: 'Token sudah dikirim',

    STATUS_EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    STATUS_EXPIRED_TOKEN_MESSAGE: 'Token kadaluarsa',

    STATUS_TOKEN_MATCH: 'STATUS_TOKEN_MATCH',
    STATUS_TOKEN_MATCH_MESSAGE: 'Token sesuai. Lanjutkan pendaftaran akun.',

    STATUS_TOKEN_NOT_MATCH: 'TOKEN_NOT_MATCHED',
    STATUS_TOKEN_NOT_MATCH_MESSAGE: 'Token tidak sesuai',

    STATUS_OLD_PASSWORD_NOT_MATCH: 'OLD_PASSWORD_NOT_MATCH',
    STATUS_OLD_PASSWORD_NOT_MATCH_MESSAGE: 'Kata kunci lama tidak benar',

    STATUS_AUTH_AUTHORIZED: 'AUTHORIZED',
    STATUS_AUTH_AUTHORIZED_MESSAGE: 'AUTHORIZED',

    STATUS_AUTH_NOT_AUTHORIZED: 'NOT_AUTHORIZED',
    STATUS_AUTH_NOT_AUTHORIZED_MESSAGE: 'Tidak diizinkan masuk',

    STATUS_LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',
    STATUS_LIMIT_EXCEEDED_MESSAGE: 'Melebihi batas yang diperbolehkan',

    STATUS_USER_EMAIL_REQUIRED: 'EMAIL_REQUIRED',
    STATUS_USER_EMAIL_REQUIRED_MESSAGE: 'Email harus diisi',

    STATUS_USER_FULL_NAME_REQUIRED: 'STATUS_USER_FULL_NAME_REQUIRED',
    STATUS_USER_FULL_NAME_REQUIRED_MESSAGE: 'Nama lengkap harus diisi',

    STATUS_DEVICE_ID_REQUIRED: 'STATUS_DEVICE_ID_REQUIRED',
    STATUS_DEVICE_ID_REQUIRED_MESSAGE: 'Identitas perangkat harus diisi',

    STATUS_BANK_ID_REQUIRED: 'STATUS_BANK_ID_REQUIRED',
    STATUS_BANK_ID_REQUIRED_MESSAGE: 'Bank harus diisi',

    STATUS_USER_PASSWORD_REQUIRED: 'PASSWORD_REQUIRED',
    STATUS_USER_OLD_PASSWORD_REQUIRED: 'Kata sandi yang lama diperlukan',
    STATUS_USER_NEW_PASSWORD_REQUIRED: 'Kata sandi yang baru diperlukan',
    STATUS_USER_NEW_OLD_PASSWORD_DIFF_REQUIRED: 'Kata sandi yang baru dan yang lama harus berbeda',
    STATUS_USER_PASSWORD_REQUIRED_MESSAGE: 'Kata kunci harus diisi',

    STATUS_PARAMETERS_PAYMENT_CATEGORY_REQUIRED: 'PARAMETERS_PAYMENT_CATEGORY_REQUIRED',
    STATUS_PARAMETERS_PAYMENT_CATEGORY_REQUIRED_MESSAGE: 'Kategori payment harus diisi',

    STATUS_PARAMETERS_MERCHANT_REQUIRED: 'PARAMETERS_MERCHANT_REQUIRED',
    STATUS_PARAMETERS_MERCHANT_REQUIRED_MESSAGE: 'Cabang harus diisi',

    STATUS_PARAMETERS_AMOUNT_REQUIRED: 'STATUS_PARAMETERS_AMOUNT_REQUIRED',
    STATUS_PARAMETERS_AMOUNT_REQUIRED_MESSAGE: 'Jumlah donasi harus diisi',

    STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED: 'STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED',
    STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED_MESSAGE: 'Campaign ID harus diisi',

    STATUS_PARAMETERS_PAYMENT_CATEGORY_ID_REQUIRED: 'STATUS_PARAMETERS_PAYMENT_CATEGORY_ID_REQUIRED',
    STATUS_PARAMETERS_PAYMENT_CATEGORY_ID_REQUIRED_MESSAGE: 'Kategori pembayaran harus diisi',

    STATUS_PARAMETERS_PARAMETETERS_REQUIRED: 'STATUS_PARAMETERS_PARAMETETERS_REQUIRED',
    STATUS_PARAMETERS_PARAMETETERS_REQUIRED_MESSAGE: 'STATUS_PARAMETERS_PARAMETETERS_REQUIRED_MESSAGE',

    STATUS_OLD_PASSWORD_IS_NOT_MATCH_MESSAGE: 'Kata kunci yang lama salah',
    STATUS_NEW_PASSWORD_IS_SUCCESS_UPDATED_MESSAGE: 'Berhasil mengganti kata kunci dengan yang baru',
    STATUS_AVATAR_SUCCESS_UPLOADED: 'Berhasil merubah profil avatar',

    STATUS_UNEXPECTED_ERROR: 'STATUS_UNEXPECTED_ERROR',
    STATUS_UNEXPECTED_ERROR_MESSAGE: 'STATUS_UNEXPECTED_ERROR_MESSAGE',
    STATUS_PARAMETERS_TRANSACTION_ID_REQUIRED_MESSAGE: 'STATUS_PARAMETERS_TRANSACTION_ID_REQUIRED_MESSAGE',
    STATUS_TOKEN_REQUIRED_MESSAGE: 'Token harus diisi',
    STATUS_REQUIRED_IMAGE_MESSAGE: 'Gambar harus diisi',
    STATUS_TRANSACTION_DOES_NOT_EXIST_MESSAGE: 'Transaksi tidak tersedia',

    /**
     * update payment status
     */
    STATUS_PAYMENT_STATUS_PROOF_RECEIVED: 'PAYMENT PROOF RECEIVED',
    STATUS_PAYMENT_STATUS_PROOF_RECEIVED_MESSAGE:'Bukti transfer telah diterima, kami akan segera memverifikasi pembayaran anda',
    STATUS_PAYMENT_STATUS_UNCONFIRMED_PAYMENT: 'UNCONFIRMED PAYMENT',
    STATUS_PAYMENT_STATUS_EXPIRED: 'PAYMENT EXPIRED',
    STATUS_PAYMENT_STATUS_PROOF_NOT_VALID: 'PAYMENT PROOF NOT VALID',
    STATUS_PAYMENT_STATUS_PAYMENT_PROCESSED: 'PAYMENT PROCESSED',
    STATUS_PAYMENT_STATUS_PAYMENT_APPROVED: 'PAYMENT APPROVED',
    STATUS_CAMPAIGN_NOT_FOUND_MESSAGE: 'Campaign ID tidak tersedia',

    PREFS_AGENDA_JOB_PAYMENT_STATUS_MAILLER_UPDATER: 'PREFS_AGENDA_JOB_PAYMENT_STATUS_MAILLER_UPDATER',
    PREFS_AGENDA_JOB_GOLD_PRICE_UPDATER: 'PREFS_AGENDA_JOB_GOLD_PRICE_UPDATER',
    AGENDA_JOB_GOLD_PRICE_CHECK: 'AGENDA_JOB_GOLD_PRICE_CHECK',
    AGENDA_JOB_CHECK_PAYMENT_EXPIRED: 'AGENDA_JOB_CHECK_PAYMENT_EXPIRED',
    AGENDA_JOB_CHECK_PAYMENT_NEED_FIRST_REMINDER: 'AGENDA_JOB_CHECK_PAYMENT_NEED_FIRST_REMINDER',
    AGENDA_JOB_CHECK_PAYMENT_NEED_FINAL_REMINDER: 'AGENDA_JOB_CHECK_PAYMENT_NEED_FINAL_REMINDER',

    STATUS_CATEGORIES_SLUG_REQUIRED: 'STATUS_CATEGORIES_SLUG_REQUIRED',
    STATUS_TRANSACTION_ID_AND_TOKEN_NOT_MATCH: 'STATUS_TRANSACTION_ID_AND_TOKEN_NOT_MATCH'

};
