class ReturnReasonService {
    constructor(returnReasonRepository) {
        this.returnReasonRepository = returnReasonRepository;
    }

    async create(data) {
        return await this.returnReasonRepository.create(data);
    }

    async findAll(query) {
        return await this.returnReasonRepository.findAll(query);
    }

    async findById(id) {
        return await this.returnReasonRepository.findById(id);
    }

    async update(id, data) {
        return await this.returnReasonRepository.update(id, data);
    }

    async delete(id) {
        return await this.returnReasonRepository.delete(id);
    }
}

export default ReturnReasonService;
