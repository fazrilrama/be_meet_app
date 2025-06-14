import { Controller, Post, Body, Req, Get, Query } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
    constructor(private readonly CompanyService: CompanyService) {}

    @Get()
    getCompany() {
        return this.CompanyService.list();
    }
}