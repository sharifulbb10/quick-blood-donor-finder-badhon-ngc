import React, { useState, useEffect } from 'react'

export default function MainInterface() {

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [bloodGroup, setBloodGroup] = useState('');
	const [location, setLocation] = useState('');
	const [donorsName, setDonorsName] = useState('');
	const [filtered, setFiltered] = useState([]);
	const [menuOpened, setMenuOpened] = useState(false);

	useEffect(()=>{
		const getData = async () => {
			try {
				const response = await fetch("https://docs.google.com/spreadsheets/d/1Oc03vJPT66H68EJJ2fa3AT3iDmxaRZQ6Re4KrbG2lFM/gviz/tq?tqx=out:json");
				const text = await response.text();
				const json = JSON.parse(text.substring(47).slice(0, -2));
				const rows = json.table.rows.map(row => row.c.map(cell => (cell? cell.v : "")));
				setData(rows);
				setLoading(!loading);
			} catch(error) {
				console.log("error occured", error);
			}
		}

		getData();
	}, []);

	const bloodGroupQuery = (e) => {
		e.target.value!=="Choose Blood Group" ? setBloodGroup(e.target.value) : setBloodGroup(null);
	}

	const locationQuery = (e) => {
		setLocation(e.target.value);
	}

	const donorsNameQuery = (e) => {
		setDonorsName(e.target.value);
	}


	const searchFunction = () => {
		const filteredData = data.filter(eachItem => {
			const isBloodGroupMatched = bloodGroup ? eachItem.includes(bloodGroup) : true;
			const isLocationMatched = location.trim() ? eachItem[4].toLowerCase().includes(location.toLowerCase()) : true;
			const isNameMatched = donorsName.trim() ? eachItem[2].trim().toLowerCase().includes(donorsName.toLowerCase()) : true;

			if (isBloodGroupMatched && isLocationMatched && isNameMatched) {
				//console.log(eachItem)
				return true;
			};
		})
		bloodGroup || location || donorsName ? setFiltered(filteredData) : setFiltered([]);
	}

	// useEffect(()=>{console.log(filtered)},[filtered])

	useEffect(()=>{
		searchFunction();
	},[bloodGroup, location, donorsName])

	function splittedText(text, searched) {
		return searched ? text.toLowerCase().split(searched.toLowerCase()) : [text, "", ""];
	}

	function parseDate(dateString) {
		// (to test) dateString = "Date(2024,0,28)"
		const match = dateString.match(/Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})\)/);
		if (match) {
			const year = parseInt(match[1]);
			const month = parseInt(match[2]);
			const day = parseInt(match[3]);
			const inputDate = new Date(year, month, day);
			const currentDate = new Date();
			const nextEligibleDate = inputDate.setDate(inputDate.getDate() + 120); // 4 months
			console.log(currentDate>=nextEligibleDate);
			return currentDate >= nextEligibleDate;
		}
	}

	// useEffect(()=> {
	// 	parseDate("Date(2025,0,29)");
	// }),[]

	function handleMenuClick() {
		setMenuOpened(!menuOpened);
	}


	if (loading) return <div className="flex justify-center items-center">
		<h1 className="mt-[30%]">Fetching data, wait for it...</h1>
	</div>

	return (
		<div className="">
			<div className="mt-6 mx-4 flex justify-between font-bold text-red-700">
				<div>
					<h2 className="text-lg">Badhon</h2>
					<h2 className="text-sm">Narsingdi Govt. College</h2>
				</div>

				<div className="relative">
					<div className={`w-8 h-8 bg-black rounded flex flex-col justify-center items-center ${menuOpened ? 'relative': 'gap-2'} relative z-10`} onClick={handleMenuClick}>
						<div className={`w-5 h-[2px] bg-white ${menuOpened ? 'absolute inset-0 m-[auto] rotate-45' : null}`}></div>
						<div className={`w-5 h-[2px] bg-white ${menuOpened ? 'absolute inset-0 m-[auto] -rotate-45' : null}`}></div>
					</div>
					<div className={`absolute w-[70vw] h-50 top-0 right-0 bg-zinc-800 ${menuOpened ? 'visible' : 'hidden'}`}>
						<div className="mt-10 text-sm text-white font-light">
							<section className="mx-5 mt-2 p-1"><a href="https://github.com/sharifulbb10/quick-blood-donor-finder-badhon-ngc" target="_blank" rel="noopener noreferrer">View Source Code & improve it</a></section>
							<section className="mx-5 mt-4 p-1"><a href="mailto:sharifulbb10@gmail.com?subject=Found a problem in your BADON QUICK DONOR FINDER project">Report a bug</a></section>
							<section className="mx-5 mt-4 p-1"><a href="https://forms.gle/JrGsH6vggNQPkU2a9">Register as blood doner</a></section>
						</div>
					</div>
				</div>
			</div>

			<div className="fixed right-0 top-1/2 transform -translate-y-1/2 translate-x-15 -rotate-90 bg-red-800 rounded-t-md opacity-70">
				<a href="https://forms.gle/JrGsH6vggNQPkU2a9">
					<div className="py-1 px-2 flex justify-center items-center">
						{/*<img className="h-8 my-[auto]" src="src/assets/blood_donation.png" />*/}
						<p className="text-xs text-white text-center font-bold block m-[auto] opacity-100">Are you a Blood Donor?</p>
					</div>
				</a>
			</div>

			<div className="text-sm mx-4 mt-6">
				<div className="mb-2">
					<p className="inline-block w-30 mr-2">Blood Group</p>
					<select className="text-right pl-2 border-1 px-1 py-[4px] rounded" onChange={bloodGroupQuery}>
						<option>Choose Blood Group</option>
						<option>A+</option>
						<option>A-</option>
						<option>B+</option>
						<option>B-</option>
						<option>AB+</option>
						<option>AB-</option>
						<option>O+</option>
						<option>O-</option>
					</select>
				</div>
				<div className="mb-2">
					<p className="inline-block mr-2 w-30 mr-2">Current Location</p>
					<input type="text" className="border-1 px-1 py-[2px] rounded" onChange={locationQuery}/>
				</div>
				<div className="mb-2">
					<p className="inline-block mr-2 w-30 mr-2">Donor's Name</p>
					<input type="text" className="border-1 px-1 py-[2px] rounded" onChange={donorsNameQuery}/>
				</div>
			</div>
			<div className="mx-4 mt-4 text-sm">
				{
					filtered.length?
						filtered.map((eachItem, index)=>
							<p key={index} className="mt-2 bg-green-100 border border-green-300 p-[5px]">
							Blood Group: <span className="capitalize text-red-800 font-medium"><span>{splittedText(eachItem[3], bloodGroup)[0]}</span><span className="bg-yellow-200">{bloodGroup}</span><span>{splittedText(eachItem[3], bloodGroup)[1]}</span></span> <br/>

							Name: <span className="capitalize text-red-800 font-medium"><span>{splittedText(eachItem[2], donorsName)[0]}</span><span className="bg-yellow-200">{donorsName}</span><span>{splittedText(eachItem[2], donorsName)[1]}</span></span> <br/>

							Location: <span className="capitalize text-red-800 font-medium"><span>{splittedText(eachItem[4], location)[0]}</span><span className="bg-yellow-200">{location}</span><span>{splittedText(eachItem[4], location)[1]}</span></span> <br/>

							Mobile No: <span className="text-red-800 font-medium">{eachItem[5]}</span> <br/>

							<span>{eachItem[6] ? <span>Eligible to donate blood: <span className="text-red-800 font-medium">{parseDate(eachItem[6]) ? <span>YES <span className="text-black font-normal">(based on last donation)</span></span> : <span>NO <span className="text-black font-normal">(based on last donation)</span></span>}</span></span>: null}</span>
							</p>
							)
					: bloodGroup || location || donorsName ? <p className="text-red-800 text-center">No information found!</p> : <p className="text-sky-900 text-center">Search to find donor</p>
				}

			</div>
		</div>
	)
}