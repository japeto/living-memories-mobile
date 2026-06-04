import { injectable } from 'tsyringe';
import { IMemoryRepository } from '../../domain/memories/repositories/IMemoryRepository';
import { Memory } from '../../domain/memories/entities/Memory';

const SEED: Memory[] = [
  {
    id: '1',
    time: '08:30 a.m.',
    day: 'Hoy',
    text: 'Hoy me desperté pensando en la receta de arroz con leche de mi mamá. Recordé cómo olía la cocina a canela los domingos.',
    topic: 'Familia',
    mood: 'Nostálgica',
  },
  {
    id: '2',
    time: '12:15 p.m.',
    day: 'Ayer',
    text: 'Hablé con mi nieta Sofía. Me contó que sacó buenas notas en la escuela. Me hace sentir muy orgullosa de ella.',
    topic: 'Nietos',
    mood: 'Feliz',
  },
];

const NEW_QUEUE: Memory[] = [
  {
    id: '3',
    time: '02:00 p.m.',
    day: 'Hoy',
    text: 'Acabo de encontrar una foto antigua en el cajón de la sala. Es de cuando fuimos a la playa en 1985.',
    topic: 'Viajes',
    mood: 'Alegre',
  },
];

@injectable()
export class MockMemoryRepository implements IMemoryRepository {
  private memories: Memory[] = [...SEED];
  private newQueue: Memory[] = [...NEW_QUEUE];

  async getMemories(): Promise<Memory[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.memories]);
      }, 800);
    });
  }

  async getTodayMemories(): Promise<Memory[]> {
    // Simulamos un delay de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.memories].filter((m) => m.day === 'Hoy'));
      }, 800);
    });
  }

  async processNewMemory(): Promise<Memory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.newQueue.length > 0) {
          const newMem = this.newQueue.shift()!;
          this.memories.unshift(newMem);
          resolve(newMem);
        } else {
          // If queue empty, generate a dummy memory
          const fallback: Memory = {
            id: Date.now().toString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            day: 'Hoy',
            text: 'Un recuerdo nuevo espontáneo que acabo de grabar porque me acordé de algo importante.',
            topic: 'Diario',
            mood: 'Tranquila',
          };
          this.memories.unshift(fallback);
          resolve(fallback);
        }
      }, 1500); // 1.5s simulando procesamiento
    });
  }

  async uploadMemory(transcribedText: string, timeZone: string): Promise<Memory> {
    // In a real scenario, this would call uploadMemory from memoriesApiClient.
    // For now, we simulate the backend response.
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMem: Memory = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          day: 'Hoy',
          text: transcribedText || 'Transcripción no disponible.',
          topic: 'Reciente',
          mood: 'Tranquila',
        };
        this.memories.unshift(newMem);
        resolve(newMem);
      }, 1500);
    });
  }
}
