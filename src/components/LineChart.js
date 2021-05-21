import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

function LineChart() {
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [incomingData, setIncomingData] = useState({
		aggregates: [],
		data: [],
		dataLabels: [],
		xLabel: '',
		yLabel: '',
		graphTitle: '',
		title: '',
	});
	const [loaded, setLoaded] = useState(false);
	const [timeOptions] = useState(['month', 'year', 'day', 'hour']);
	const [timeSection, setTimeSelection] = useState('month');
	// http request
	// useEffect(() => {

	// 	// filterData(aggreage.data);
	// }, [startDate, endDate]);

	const handleSubmit = (e) => {
		// let endPoint = `https://square-voice-6674.guapro.workers.dev/?https://test-foretell-bpalms.adeptreality.com/sessions/sessionsovertime/hour/${startDate}/${endDate}`;
		let newEndPoint = `https://square-voice-6674.guapro.workers.dev/?https://test-foretell-bpalms.adeptreality.com/sessions/sessionsovertime/3/${timeSection}/${startDate}/${endDate}`;
		axios
			.get(newEndPoint)
			.then((response) => {
				let data = response.data;
				setIncomingData({
					aggregates: data.Aggregates[0],
					data: data.Graph.Data,
					dataLabels: data.Graph.labelData,
					xLabel: data.Graph.xLabel,
					yLabel: data.Graph.yLabel,
					graphTitle: data.Graph.graphTitle,
					title: data.Title,
				});
				// console.log(endPoint);
				console.log(data);
				setLoaded(true);
			})
			.catch((error) => {
				console.log(error);
			});
		e.preventDefault();
	};

	const handleStartDate = (e) => {
		e.preventDefault();
		setStartDate(e.target.value);
	};

	const data = {
		labels: incomingData.dataLabels,
		datasets: [
			{
				label: incomingData.graphTitle,
				data: incomingData.data,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgba(255, 99, 132, 0.2)',
			},
		],
	};

	const options = {
		maintainAspectRatio: false,
		indexAxis: 'x',
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: incomingData.yLabel,
				},
			},
			x: {
				title: {
					display: true,
					text: incomingData.xLabel,
				},
			},
		},
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		responsive: true,
		plugins: {
			legend: {
				position: 'right',
			},
			title: {
				display: true,
				text: incomingData.graphTitle,
			},
		},
	};

	return (
		<div>
			<form action="query" onSubmit={handleSubmit}>
				<div className="start-date">
					<label>Start Date:</label>
					<div className="control">
						<input
							value={startDate || ''}
							onChange={handleStartDate}
							type="text"
							placeholder="YYYY-MM-DD"
						/>
					</div>
				</div>
				<div className="end-date">
					<label>End Date:</label>
					<div className="control">
						<input
							value={endDate || ''}
							onChange={(e) => setEndDate(e.target.value)}
							type="text"
							placeholder="YYYY-MM-DD"
						/>
					</div>
				</div>
				<div className="options-dates">
					<label>Time:</label>
					<select
						value={timeSection}
						onChange={(e) => setTimeSelection(e.currentTarget.value)}
					>
						{timeOptions.map((timeOpt) => (
							<option value={timeOpt}>{timeOpt}</option>
						))}
					</select>
				</div>
				<button type="submit">Search</button>
			</form>
			{loaded && (
				<div>
					<div>
						<h1>Overview</h1>
						<h3>{incomingData.title}</h3>
						<p>
							<b>From: </b>
							{incomingData.aggregates[`From Time`]} <b>To: </b>
							{incomingData.aggregates[`Start Time`]}
						</p>
						<p>
							<b>Avg Length of Session:</b>{' '}
							{incomingData.aggregates[`Avg Length of Session`]}
						</p>
						<p>
							<b>Avg Users Per Session:</b>{' '}
							{incomingData.aggregates[`Avg Users Per Session`]}
						</p>
						<p>
							<b>Total Sessions:</b>{' '}
							{incomingData.aggregates[`Total Session Count`]}
						</p>
					</div>

					{/* <button onClick={handleClear}>Clear</button> */}
					<div
						style={{
							width: '100%',
							height: 500,
						}}
					>
						<Line data={data} options={options} />
					</div>
				</div>
			)}
		</div>
	);
}

export default LineChart;
