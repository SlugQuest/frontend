import { BACKEND_URL } from './BackendURL';
import { curr_health, user_points } from './store.ts';

let currHealth: number;
curr_health.subscribe(value => { currHealth = value });

let userPoints: number;
user_points.subscribe(value => { userPoints = value });

export async function fetchPoints() {
    const points_response = await fetch(`${BACKEND_URL}/api/v1/userPoints`, {
        method: 'GET',
        credentials: 'include'
    });

    const health_response = await fetch(`${BACKEND_URL}/api/v1/getBossHealth`, {
        method: 'GET',
        credentials: 'include'
    });

    if (points_response.ok) {
        console.log("Points response is ok");
        const points_data = await points_response.json();
        let points = points_data.points;
        console.log("Points: " + points);
        user_points.set(points);
    } else {
        console.log("Points response FAILED");
    }

    if (health_response.ok) {
        console.log("Health response is ok");
        const health_data = await health_response.json();
        let health = health_data.curr_boss_health;
        console.log("Health: " + health);
        curr_health.set(health);
    } else {
        console.log("Health response FAILED");
    }

    // user_points.set(userPoints + 1);
    // curr_health.set(currHealth - 1);

}