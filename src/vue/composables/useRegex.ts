export const isEmail =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isPhone = RegExp('(0|\\\\+33|0033)[1-9][0-9]{8}')

export const isPassword= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/

export const hasDigit = /\d/

export const hasLowerCase = /[a-z]/

export const hasSpecialCharacters = /[@$!%*?&^#]/

export const hasUpperCase = /[A-Z]/