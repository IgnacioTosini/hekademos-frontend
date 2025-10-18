import type { YouTubeSearchItem, YouTubeSearchResponse, YouTubeShort, YouTubeVideoItem, YouTubeVideosResponse } from "../types";

export class YouTubeService {
    private static API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    private static BASE_URL = 'https://www.googleapis.com/youtube/v3';

    // Función de diagnóstico
    static async testApiKey(): Promise<boolean> {
        try {
            console.log('🔍 Probando API Key...');

            if (!this.API_KEY) {
                console.error('❌ API Key no encontrada');
                return false;
            }

            const testUrl = `${this.BASE_URL}/videos?part=snippet&chart=mostPopular&maxResults=1&key=${this.API_KEY}`;
            const response = await fetch(testUrl);

            if (response.ok) {
                console.log('✅ API Key funciona correctamente');
                return true;
            } else {
                const errorData = await response.json();
                console.error('❌ Error en API Key:', response.status, errorData);
                return false;
            }
        } catch (error) {
            console.error('❌ Error probando API Key:', error);
            return false;
        }
    }

    static async searchChannelByHandle(handle: string): Promise<string | null> {
        try {
            // Verificar API Key primero
            const apiWorks = await this.testApiKey();
            if (!apiWorks) return null;

            const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;

            const response = await fetch(
                `${this.BASE_URL}/search?` +
                `part=snippet&` +
                `q=${encodeURIComponent(cleanHandle)}&` +
                `type=channel&` +
                `maxResults=10&` +
                `key=${this.API_KEY}`
            );

            if (!response.ok) {
                console.error(`Error ${response.status} buscando canal`);
                return null;
            }

            const data: YouTubeSearchResponse = await response.json();

            if (data.items && data.items.length > 0) {
                // Buscar coincidencia con Hekademos
                const match = data.items.find((item: YouTubeSearchItem) =>
                    item.snippet.title.toLowerCase().includes('hekademos') ||
                    item.snippet.description?.toLowerCase().includes('hekademos')
                );

                return match ? match.snippet.channelId : data.items[0].snippet.channelId;
            }
            return null;
        } catch (error) {
            console.error('Error searching channel:', error);
            return null;
        }
    }

    static async getChannelShorts(channelId: string): Promise<YouTubeShort[]> {
        try {
            const searchResponse = await fetch(
                `${this.BASE_URL}/search?` +
                `part=snippet&` +
                `channelId=${channelId}&` +
                `type=video&` +
                `order=date&` +
                `maxResults=50&` +
                `key=${this.API_KEY}`
            );

            if (!searchResponse.ok) return [];

            const searchData: YouTubeSearchResponse = await searchResponse.json();
            if (!searchData.items || searchData.items.length === 0) return [];

            const videoIds = searchData.items.map(item => item.id.videoId).join(',');

            const detailsResponse = await fetch(
                `${this.BASE_URL}/videos?` +
                `part=snippet,contentDetails&` +
                `id=${videoIds}&` +
                `key=${this.API_KEY}`
            );

            if (!detailsResponse.ok) return [];

            const detailsData: YouTubeVideosResponse = await detailsResponse.json();

            const shorts = detailsData.items.filter((video: YouTubeVideoItem) => {
                const duration = this.parseDuration(video.contentDetails.duration);
                return duration <= 60;
            });

            return shorts.map((short: YouTubeVideoItem): YouTubeShort => ({
                title: short.snippet.title,
                url: `https://www.youtube.com/shorts/${short.id}`,
                videoId: short.id,
                thumbnail: short.snippet.thumbnails.default.url,
                publishedAt: short.snippet.publishedAt
            }));

        } catch (error) {
            console.error('Error fetching YouTube Shorts:', error);
            return [];
        }
    }

    private static parseDuration(duration: string): number {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = (match?.[1] ? parseInt(match[1]) : 0) || 0;
        const minutes = (match?.[2] ? parseInt(match[2]) : 0) || 0;
        const seconds = (match?.[3] ? parseInt(match[3]) : 0) || 0;
        return hours * 3600 + minutes * 60 + seconds;
    }

    // Datos de prueba como fallback
    static getMockShorts(): YouTubeShort[] {
        return [
            {
                title: "Ejercicio de Respiración Consciente - Hekademos",
                url: "https://www.youtube.com/shorts/mock1",
                videoId: "mock1",
                thumbnail: "https://img.youtube.com/vi/mock1/mqdefault.jpg",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Estiramiento Matutino - Despertar el Cuerpo",
                url: "https://www.youtube.com/shorts/mock2",
                videoId: "mock2",
                thumbnail: "https://img.youtube.com/vi/mock2/mqdefault.jpg",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Meditación de 5 Minutos - Centrarse",
                url: "https://www.youtube.com/shorts/mock3",
                videoId: "mock3",
                thumbnail: "https://img.youtube.com/vi/mock3/mqdefault.jpg",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Ejercicios de Movilidad Articular",
                url: "https://www.youtube.com/shorts/mock4",
                videoId: "mock4",
                thumbnail: "https://img.youtube.com/vi/mock4/mqdefault.jpg",
                publishedAt: new Date().toISOString()
            },
            {
                title: "Técnica de Relajación Muscular Progresiva",
                url: "https://www.youtube.com/shorts/mock5",
                videoId: "mock5",
                thumbnail: "https://img.youtube.com/vi/mock5/mqdefault.jpg",
                publishedAt: new Date().toISOString()
            }
        ];
    }
}