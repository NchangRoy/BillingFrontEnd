import { UpdatedProductResponse } from "../models/UpdatedProductResponse";

const BASE_URL = 'http://localhost:8080/api/v1/products';

export class ProductApiService {
    /**
     * Fetches products from the Spring Boot Flux endpoint
     * @param orgId - The UUID of the organization
     */
    static async getProductsByOrganization(orgId: string): Promise<UpdatedProductResponse[]> {
        const url = `${BASE_URL}/organization/${orgId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization headers here if needed
                    // 'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                // Handle 404, 500, etc.
                const errorBody = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorBody}`);
            }

            // Even though the backend returns a Flux, 
            // Fetch/Browser treats it as a standard JSON array 
            // unless you use ReadableStreams.
            const data: UpdatedProductResponse[] = await response.json();
            return data;

        } catch (error) {
            console.error("Failed to fetch organization products:", error);
            throw error;
        }
    }
}