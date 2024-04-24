const rewardsService = require("../service/rewards");

class RewardsController {
	async calculateRewards(req, res) {
		try {
			const result = await rewardsService.calculateRewards(req)

			res.send(result);
		}
		catch (err) {
			console.error(err)
		}
	}
}

module.exports = new RewardsController()
