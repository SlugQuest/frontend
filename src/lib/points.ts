import { BACKEND_URL } from './BackendURL';
import { curr_health, user_points, boss_ID, boss_name, boss_image } from './store.ts';

let imagePath = '';

let currHealth: number;
curr_health.subscribe(value => { currHealth = value });

let userPoints: number;
user_points.subscribe(value => { userPoints = value });

let bossID: number;
boss_ID.subscribe(value => { bossID = value });

let bossName: string;
boss_name.subscribe(value => { bossName = value });

let bossImage: string;
boss_image.subscribe(value => { bossImage = value });

export async function getBossID() {
    const response = await fetch(`${BACKEND_URL}/api/v1/user`, {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json();
        let id = data.BossID;
        boss_ID.set(id);
    }

    fetchBossImage();
}

export async function fetchBossImage() {
    const response = await fetch(`${BACKEND_URL}/api/v1/getBoss/${bossID}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        const data = await response.json();
        let name = data.boss.Name;
        let image = data.boss.Image;
        boss_name.set(name);
        boss_image.set(image);
    }
}

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

    fetchBossImage();
}