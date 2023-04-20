import decode from "jwt-decode";


class AuthService {
	// Get user data
	getProfile() {
		return decode(this.getToken());
	}

	// Check if the user is logged in
	loggedIn() {

		const token = this.getToken();

		return !!token && !this.isTokenExpired(token) ? true : false;
	}

	// Check if token is expired
	isTokenExpired(token) {
		try {

			const decoded = decode(token);

			if (decoded.exp < Date.now() / 1000) {

				localStorage.removeItem("id_token");

				return true;

			} else return false;

		} catch (err) {
      
			return false;
		}
	}


	getToken() {
		return localStorage.getItem("id_token");
	}


	login(idToken) {
		localStorage.setItem("id_token", idToken);

		window.location.assign("/");
	}

	logout() {
		localStorage.removeItem("id_token");

		window.location.assign("/");
	}
}

export default new AuthService();