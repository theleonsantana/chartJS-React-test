import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function BrokenLineChart() {
	const [incomingData, setIncomingData] = useState({
		aggregates: [],
		data: [],
		dataLabels: [],
		yLabels: [],
		xLabel: '',
		yLabel: '',
		graphTitle: '',
		title: '',
	});
	const { loaded, setLoaded } = useState(false);

	const data = {
		labels: incomingData.dataLabels,
		datasets: incomingData.data,
	};

	// const zoomOpt = {
	// 	limits: {
	// 		x: { min: -200, max: 200, minRange: 50 },
	// 		y: { min: -200, max: 200, minRange: 50 },
	// 	},
	// 	pan: {
	// 		enabled: true,
	// 		mode: 'xy',
	// 	},
	// 	zoom: {
	// 		wheel: {
	// 			enabled: true,
	// 		},
	// 		pinch: {
	// 			enabled: true,
	// 		},
	// 		mode: 'xy',
	// 	},
	// };

	const options = {
		type: 'line',
		// indexAxis: 'y',
		responsive: true,
		legend: { display: false },
		interaction: {
			intersect: false,
		},
		// plugins: {
		// 	zoom: zoomOpt,
		// add scales options. (Aks Joe for Help)
		// },
		scales: {
			y: {
				min: 0,
				// max: 4,
				ticks: {
					stepSize: 1,
					callback: function (value, index, values) {
						console.log('value, index, values', value, index, values);
						return incomingData.yLabels[index];
					},
				},
			},
		},
	};

	useEffect(() => {
		axios
			.get(
				'https://square-voice-6674.guapro.workers.dev/?https://test-foretell-bpalms.adeptreality.com/sessions/userbreakdown/3/104'
			)
			.then((response) => {
				let data = response.data;
				let periods = [];
				let yLabels = [];

				yLabels.push('');
				data.Graph.Data.forEach((userData) => {
					yLabels.push(userData.username);
					let dataSet = {
						data: userData.periods,
						label: userData.username,
						tension: 0,
						fill: false,
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgba(255, 99, 132, 0.2)',
					};
					periods.push(dataSet);
				});
				yLabels.push('');
				setIncomingData({
					data: periods,
					yLabels: yLabels,
					dataLabels: data.Graph.labelData,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div>
			<h2>Broken Line Chart</h2>
			<div style={{ width: `100%`, height: 500 }}>
				<Line data={data} options={options} />
			</div>
		</div>
	);
}

export default BrokenLineChart;
