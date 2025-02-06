loaded_modal = false;
downloaded_modal = false;

async function load_modal() {
	if (loaded_modal == false) {
		let bd = document.querySelector("body");
		let modal_div = document.createElement('div');
		modal_div.id = "modal-container";
		modal_div.style.display = "none";
		const url = "modal.html";
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}
			const txt = await response.text();
			modal_div.innerHTML = txt;
			bd.appendChild(modal_div);
			//show_modal();
		} catch (error) {
			console.error(error.message);
		}
	}
}

function show_modal() {
	let elem = document.getElementById("modal-container");
	elem.style.display = "block";
}

function hide_modal() {
	let elem = document.getElementById("modal-container");
	elem.style.display = "none";
}

async function submit_form() {
	
    const first_name = document.querySelector("#firstname > input").value;
    const last_name = document.querySelector("#lastname > input").value;
    const company_name = document.querySelector("#company_name > input").value;
    const job_title = document.querySelector("#job_title > input").value;
    const company_location = document.querySelector("#company_location > input").value;
    const unit_number = document.querySelector("#unit_number > input").value;
    const message = document.querySelector("#message_box > textarea").value;
    const email = document.querySelector("#email > input").value;
	let resp_message = document.querySelector("div.resp_message");
	resp_message.className = "resp_message";
	try {
		const response = await fetch("https://email.owen-8c8.workers.dev", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(
				{
					"email": email,
					"first_name": first_name,
					"last_name": last_name,
					"company_name": company_name, 
					"title": job_title, 
					"location": company_location, 
					"unit_no": unit_number, 
					"message": message 
				}
			)
		});
		if (response.status == 200) {
			resp_message.className += " resp_message_success";
			resp_message.innerHTML = "Submitted";
		} else {
			resp_message.className += " resp_message_error";
			resp_message.innerHTML = "There was an issue submitting the contact form, go ahead and send us an email linked at the bottom of the page.";
		}
	} catch (error) {
		resp_message.className += " resp_message_error";
		resp_message.innerHTML = "There was an issue submitting the contact form, go ahead and send us an email linked at the bottom of the page.";
	}
    const result = await response.json();
}

load_modal();
