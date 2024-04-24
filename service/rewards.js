const RewardsDAO = require('../dao/rewards')

class FileService {
	async calculateRewards() {
		const result = await RewardsDAO.calculateRewards()
		const users = [];
		const userIds = new Set();
		const totalDonations = result.rows.reduce((acc, e) => {
			acc += e.total_donation_in_usd;
			return acc;
		}, 0);
		const rewardPool = 10000;

		result.rows.forEach(employee => {
			const rewardPercentage = (employee.total_donation_in_usd / totalDonations);
			const reward = Math.round(rewardPercentage * rewardPool);

			if (!userIds.has(employee.id)) {
				users.push({id: employee.id, name: employee.name, donated: employee.total_donation_in_usd, reward})
				userIds.add(employee.id)
			} else {
				const user = users.find((user) => user.id === employee.id)
				user.donated += employee.total_donation_in_usd;
				user.reward += reward;
			}
		});

		return users;
	}
}

module.exports = new FileService()
