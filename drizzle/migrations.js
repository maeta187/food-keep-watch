// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './0000_cool_silver_sable'
import m0001 from './0001_wandering_chamber'
import journal from './meta/_journal.json'

export default {
	journal,
	migrations: {
		m0000,
		m0001
	}
}
