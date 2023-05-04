import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from '@src/entities/seller.entity';
import { Repository } from 'typeorm';
import { CreateSellerDto } from './dto/create-seller.dto';
import { Account } from '@src/entities/account.entity';
import { UpdateSellerDto } from './dto/update.seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  /**
   * 판매자를 생성한다.
   *
   * @param {CreateSellerDto} createSellerDto
   * @return {*}  {Promise<bigint>}
   * @memberof SellerService
   */
  async createSeller(
    accountId: bigint,
    createSellerDto: CreateSellerDto,
  ): Promise<bigint> {
    const account = await this.accountRepository.findOneBy({
      id: accountId,
    });

    if (!account) {
      throw new NotFoundException();
    }

    const seller = Seller.of(
      createSellerDto.name,
      createSellerDto.address,
      account,
    );

    const { id } = await this.sellerRepository.save(seller);

    return id;
  }

  /**
   * 판매자를 id로 검색한다.
   *
   * @param {bigint} sellerId
   * @return {*}  {Promise<Seller>}
   * @memberof SellerService
   */
  async findSellerById(sellerId: bigint): Promise<Seller> {
    const seller = await this.sellerRepository.findOneBy({
      id: sellerId,
    });

    if (!seller) {
      throw new NotFoundException();
    }

    return seller;
  }

  /**
   * 판매자 정보를 변경한다.
   *
   * @param {bigint} sellerId
   * @param {UpdateSellerDto} updateSellerDto
   * @return {*}  {Promise<void>}
   * @memberof SellerService
   */
  async updateSeller(
    sellerId: bigint,
    updateSellerDto: UpdateSellerDto,
  ): Promise<void> {
    const seller = await this.sellerRepository.findOneBy({
      id: sellerId,
    });

    if (!seller) {
      throw new NotFoundException();
    }

    seller.update(updateSellerDto.name, updateSellerDto.address);

    await this.sellerRepository.save(seller);
  }
}
