import { injectable } from 'tsyringe';
import { IMemoryRepository } from '../../domain/memories/repositories/IMemoryRepository';
import { Memory } from '../../domain/memories/entities/Memory';

const SEED: Memory[] = [
  {
    id: 1,
    time: '09:30 AM',
    day: 'Hoy',
    text: 'Amanecí con energía, desayuné avena y salí a caminar por el parque. Me encontré con Marta.',
    topic: 'Salud',
    mood: 'Feliz',
  },
  {
    id: 2,
    time: '02:15 PM',
    day: 'Hoy',
    text: 'Hablé con mi nieto por teléfono. Me contó que sacó buena nota en matemáticas. Me sentí muy orgullosa.',
    topic: 'Familia',
    mood: 'Emocionada',
    reminder: 'Llamarlo de nuevo el domingo',
  }
];

const NEW_QUEUE: Memory[] = [
  {
    id: 3,
    time: 'Ahora',
    day: 'Hoy',
    text: 'Acabo de recordar cuando fuimos a la playa en 1985. El agua estaba tan fría pero reímos mucho.',
    topic: 'Recuerdos',
    mood: 'Nostálgica',
  }
];

@injectable()
export class MockMemoryRepository implements IMemoryRepository {
  private memories: Memory[] = [...SEED];
  private newQueue: Memory[] = [...NEW_QUEUE];

  async getTodayMemories(): Promise<Memory[]> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.memories]);
      }, 500);
    });
  }

  async processNewMemory(): Promise<Memory> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.newQueue.length > 0) {
          const newMem = this.newQueue.shift()!;
          this.memories.unshift(newMem);
          resolve(newMem);
        } else {
          // If queue empty, generate a dummy memory
          const fallback: Memory = {
            id: Date.now(),
            time: 'Ahora',
            day: 'Hoy',
            text: 'Otro recuerdo guardado exitosamente.',
            topic: 'General',
            mood: 'Tranquila'
          };
          this.memories.unshift(fallback);
          resolve(fallback);
        }
      }, 1000); // 1 second simulated processing to make UI snappier
    });
  }

  async uploadMemory(transcribedText: string): Promise<Memory> {
    // In a real scenario, this would call uploadMemory from memoriesApiClient.
    // For now, we simulate the backend response.
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMem: Memory = {
          id: Date.now(),
          time: 'Ahora',
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
