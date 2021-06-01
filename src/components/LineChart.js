import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import {
	Grid,
	Paper,
	FormControl,
	Select,
	FormHelperText,
	MenuItem,
	InputLabel,
	Button,
	List,
	ListItem,
	ListItemText,
	Divider,
	Box,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {
	MuiPickersUtilsProvider,
	KeyboardTimePicker,
	KeyboardDatePicker,
} from '@material-ui/pickers';

function LineChart() {
	const [selectDate, setDate] = useState(moment());
	const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
	const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
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
	const [sessions, setSessions] = useState([]);
	// Pagination front-end
	const itemsPerPAge = 10;
	const [page, setPage] = useState(1);
	const [noOfPages, setNoOfPages] = useState(0);
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
				setSessions(data.Sessions);
				setLoaded(true);
			})
			.catch((error) => {
				console.log(error);
			});
		// sessions
		// 	? setNoOfPages(Math.ceil(sessions.length / itemsPerPAge))
		// 	: console.log('loading sessions');
		e.preventDefault();
	};

	const handleStartDate = (startDate, value) => {
		setDate(startDate);
		setStartDate(value);
	};

	const handleEndDate = (endDate, value) => {
		setDate(endDate);
		setEndDate(value);
	};

	const dateFormatter = (str) => {
		return str;
	};

	const handleTimePeriods = (e) => {
		const time = e.target.name;
		setTimeSelection(e.target.value);
	};

	const handleNewPage = (e, value) => {
		setPage(value);
	};

	useEffect(() => {
		setNoOfPages(Math.ceil(sessions.length / itemsPerPAge));
	}, [sessions]);

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
				position: 'bottom',
			},
			title: {
				display: true,
				text: incomingData.graphTitle,
			},
		},
	};

	return (
		<div style={{ width: `100%` }}>
			<Grid container justify="flex-left">
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<KeyboardDatePicker
						autoOk={true}
						showTodayButton={true}
						variant="inline"
						format="YYYY-MM-DD"
						margin="normal"
						id="date-picker-inline"
						label="Start Date"
						inputValue={startDate}
						onChange={handleStartDate}
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
						style={{ marginRight: 10 }}
					/>
					<KeyboardDatePicker
						autoOk={true}
						showTodayButton={true}
						variant="inline"
						format="YYYY-MM-DD"
						margin="normal"
						id="date-picker-inline"
						label="End Date"
						inputValue={endDate}
						onChange={handleEndDate}
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
						style={{ marginRight: 10 }}
					/>
				</MuiPickersUtilsProvider>
				<FormControl
					style={{
						minWidth: 150,
						marginRight: 10,
						marginTop: 16,
						marginBottom: 8,
					}}
				>
					<InputLabel>Time Periods:</InputLabel>
					<Select native value={timeSection} onChange={handleTimePeriods}>
						{timeOptions.map((timeOpt) => (
							<option value={timeOpt}>{timeOpt}</option>
						))}
					</Select>
				</FormControl>
				<Button
					variant="contained"
					size="small"
					color="primary"
					type="submit"
					onClick={handleSubmit}
					style={{ marginTop: 16, marginBottom: 8 }}
				>
					Search
				</Button>
			</Grid>
			{loaded && (
				<React.Fragment>
					<Paper
						elevation={3}
						style={{ padding: `20px 40px`, marginTop: 30, height: 500 }}
					>
						<Grid container>
							<Grid item xs={3}>
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
							</Grid>

							{/* <button onClick={handleClear}>Clear</button> */}
							<Grid
								item
								xs
								style={{
									width: 600,
									height: 500,
								}}
							>
								<Line data={data} options={options} />
							</Grid>
						</Grid>
					</Paper>
					<div>
						<Paper elevation={3} style={{ marginTop: 30 }}>
							<h1 style={{ padding: `20px 40px 0` }}>Sessions</h1>
							<List dense component="span">
								{sessions
									.slice((page - 1) * itemsPerPAge, page * itemsPerPAge)
									.map((uniqSesssion) => {
										return (
											<ListItem
												key={uniqSesssion.session_id}
												button
												component="a"
												href={`https://test-foretell-bpalms.adeptreality.com/userbreakdown/graph?session=${uniqSesssion.session_id}`}
												target="_blank"
												style={{ paddingLeft: 40 }}
												// onClick={() => console.log('clicked')}
												// onClick={`location.href = https://test-foretell-bpalms.adeptreality.com/userbreakdown/graph?session=${uniqSesssion.session_id}`}
											>
												<ListItemText
													primary={
														<p>
															<b>ID: </b>
															{uniqSesssion.session_id}
															<b>Session Name: </b>
															{uniqSesssion.session_name}
														</p>
													}
													secondary={
														<>
															<p>
																<b>Beginning at: </b> {uniqSesssion.start_time}{' '}
																<b>Ending at:</b> {uniqSesssion.end_time}
															</p>
														</>
													}
												/>
											</ListItem>
										);
									})}
							</List>
							<Divider />
							<Box component="span">
								<Pagination
									count={noOfPages}
									page={page}
									onChange={handleNewPage}
									defaultPage={1}
									color="primary"
									size="small"
									showFirstButton
									showLastButton
								/>
							</Box>
						</Paper>
					</div>
				</React.Fragment>
			)}
		</div>
	);
}

export default LineChart;
