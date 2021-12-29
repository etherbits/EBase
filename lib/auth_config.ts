import { argon2id, Options } from 'argon2'

const argon2Config: Options & { raw: false } = {
	type: argon2id,
	timeCost: 5,
	memoryCost: 16384, // 16MiB
	parallelism: 4,
	hashLength: 32,
	raw: false,
}

export { argon2Config }
