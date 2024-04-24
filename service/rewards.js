const RewardsDAO = require('../dao/rewards')

class FileService {
	async calculateRewards() {
		const result = await RewardsDAO.calculateRewards()
    
		const users = []
		const totalDonations = result.rows.reduce((acc, e) => {
			acc += e.total_donation_in_usd;
			return acc;
		}, 0);
		const rewardPool = 10000;

		result.rows.forEach(employee => {
			const rewardPercentage = (employee.total_donation_in_usd / totalDonations);
			const reward = Math.round(rewardPercentage * rewardPool);

			users.push({name: employee.name, donated: employee.total_donation_in_usd, reward})
		});

		return users;
	}
}

module.exports = new FileService()
