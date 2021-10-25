import { Repository, EntityRepository } from 'typeorm';
import { DoctorEntity } from './doctors.entity';

@EntityRepository(DoctorEntity)
export class DoctorsRepository extends Repository<DoctorEntity> {
  async getDoctorById(doctorId: number): Promise<DoctorEntity> {
    return this.createQueryBuilder('doc')
      .leftJoinAndSelect('doc.queue', 'q')
      .where('doc.id = :id', { id: doctorId })
      .getOne();
  }

  async getAllBySpecializationId(specId: number): Promise<DoctorEntity[]> {
    return this.createQueryBuilder('doc')
      .leftJoinAndSelect('doc.queue', 'q')
      .where('doc.specializationId = :id', { id: specId })
      .getMany();
  }

  async findDoctorByUser(userId: number): Promise<DoctorEntity> {
    return this.findOne({ userId });
  }
}
