import React, { useState, useEffect } from 'react'

export default function MainInterface() {

	const [data, setData] = useState([]); 				// blood donors data from google spreadsheet
	const [loading, setLoading] = useState(true);		// when api is fetched, loading will become false
	const [bloodGroup, setBloodGroup] = useState(''); 	// for blood group search, user's selected blood group as state
	const [location, setLocation] = useState(''); 		// for location search, user's typed location as state
	const [donorsName, setDonorsName] = useState(''); 	// for donor search by name, user's typed name as state
	const [filtered, setFiltered] = useState([]); 		// to show the search result, 'filtered' state will get updated with search results
	const [menuOpened, setMenuOpened] = useState(false); // state update for user's clicks on the top-right nav icon

	// to fetch data from google sheet api
	useEffect(()=>{
		const getData = async () => {
			try {
				const response = await fetch("https://docs.google.com/spreadsheets/d/1Oc03vJPT66H68EJJ2fa3AT3iDmxaRZQ6Re4KrbG2lFM/gviz/tq?tqx=out:json");
				const text = await response.text();
				const json = JSON.parse(text.substring(47).slice(0, -2)); // to remove unnecessary parts from the api
				const rows = json.table.rows.map(row => row.c.map(cell => (cell? cell.v : "")));
				setData(rows); 			// 'data' state update
				setLoading(!loading); 	// 'loading' state update
			} catch(error) {
				console.log("error occured", error);
			}
		}

		getData();  // function call
	}, []);

	// this function is triggered when user will select a blood group
	const bloodGroupQuery = (e) => {
		// "Choose a blood group" is a default option, so no state update for this selection
		e.target.value!=="Choose Blood Group" ? setBloodGroup(e.target.value) : setBloodGroup(null);
	}

	// this function will update the 'location' state, what user will type
	const locationQuery = (e) => {
		setLocation(e.target.value);
	}

	// this function will update the 'donorName' state, what user will type to search donor by name
	const donorsNameQuery = (e) => {
		setDonorsName(e.target.value);
	}

	// this block of code may seem complex, but a careful look will make it easier to understand
	// mainly, this function will filter out the data based on user's search from 'data' state
	// here, 'bloodGroup', 'location' and 'donorsName' state will be assessed whether each of them are updated or not
	// if a state (above) is NOT updated (meaning that the user didn't search it), it will assign 'true'
	// if a state is updated (meaning that user has searched it), then it will see whether the corresponding index of 'data' ('eachItem' variable) contains it or not
	// if it returns three 'true's, finally we can filter that index of 'data' ('eachItem' variable) as a user search result
	const searchFunction = () => {
		const filteredData = data.filter(eachItem => {
			const isBloodGroupMatched = bloodGroup ? eachItem.includes(bloodGroup) : true;
			const isLocationMatched = location.trim() ? eachItem[4].toLowerCase().includes(location.toLowerCase()) : true;
			const isNameMatched = donorsName.trim() ? eachItem[2].trim().toLowerCase().includes(donorsName.toLowerCase()) : true;

			if (isBloodGroupMatched && isLocationMatched && isNameMatched) {
				return true;
			};
		})
		bloodGroup || location || donorsName ? setFiltered(filteredData) : setFiltered([]);
	}

	// if any of the state (bloodGroup, location, donorsName) gets updated (meaaning that the user searches something),
	// the above 'searchFunction()' will be called.
	useEffect(()=>{
		searchFunction();
	},[bloodGroup, location, donorsName])

	// this function will highlight the searched portion, to help user see which part is matched from his/her search
	// in the extracted search result
	// you will find the use of this function in line (169 - 173).
	function splittedText(text, searched) {
		return searched ? text.toLowerCase().split(searched.toLowerCase()) : [text, "", ""];
	}

	// this function will evaluate if a user can donate blood or not, when he/she donated blood
	// this function will get triggered if the data[i][6] (i = 0, 1, 2, ...) contains a date string
	// meaning that a blood donor has mentioned his/her last blood donation date on the google form
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

	// this will update the state 'menuOpened', when a user clicks on nav icon
	function handleMenuClick() {
		setMenuOpened(!menuOpened);
	}

	// the loading page when data is not fetched or is fetching
	if (loading) return <div className="flex justify-center items-center">
		<h1 className="mt-[30%]">Fetching data, wait for it...</h1>
	</div>

	// the main HTML interface starts from here
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
							<section className="mx-5 mt-2 p-1"><a href="#">View Source Code & improve it</a></section>
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
							Blood Group: <span className="capitalize text-red-800 font-medium"><span>{splittedText(eachItem[3], bloodGroup)[0]}</span><span className="bg-yellow-200">{bloodGroup.toLowerCase()}</span><span>{splittedText(eachItem[3], bloodGroup)[1]}</span></span> <br/>

							Name: <span className="capitalize text-red-800 font-medium"><span>{splittedText(eachItem[2], donorsName)[0]}</span><span className="bg-yellow-200">{donorsName.toLowerCase()}</span><span>{splittedText(eachItem[2], donorsName)[1]}</span></span> <br/>

							Location: <span className="capitalize text-red-800 font-medium"><span>{splittedText(eachItem[4], location)[0]}</span><span className="bg-yellow-200">{location.toLowerCase()}</span><span>{splittedText(eachItem[4], location)[1]}</span></span> <br/>

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