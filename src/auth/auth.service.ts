import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try{
      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token: this.generateJwt({id: user.id})
      }

    }catch(err){
      if(err.code === '23505'){
        throw new BadRequestException(`User already exists ${err.detail}`);
      }

      this.logger.error(err);

      throw new InternalServerErrorException('General error, check server logs');
    }

  }

  async login(loginUserDto: LoginUserDto) {
   
    let { password, email } = loginUserDto;
    email = email.toLowerCase().trim();

    const user = await this.userRepository.findOne({ 
      where: {email},
      select: {email: true, password: true, id: true}
    });

    if(!user){
      throw new BadRequestException(`User not found ${email}`);
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new BadRequestException(`Invalid credentials ${email}`);
    }

    return {
      ...user,
      token: this.generateJwt({id: user.id})
    }
  }

  checkAuthStatus(user: User){
    return {
      ...user,
      token: this.generateJwt({id: user.id})
    }
  }

  private generateJwt(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
