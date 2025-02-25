import {
    Controller,
    Post,
    Body,
    Get,
    Res,
    Req,
    Header,
    Query,
    Param,
    Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VerificationRequestService } from "./verification-request.service";
import type { BaseRequest } from "../types";
import { parse } from "url";
import { ConfigService } from "@nestjs/config";
import { ViewService } from "../view/view.service";
import type { Response } from "express";
import { ReviewTaskService } from "../review-task/review-task.service";
import { CreateVerificationRequestDTO } from "./dto/create-verification-request-dto";
import { UpdateVerificationRequestDTO } from "./dto/update-verification-request.dto";
import { IsPublic } from "../auth/decorators/is-public.decorator";

@Controller(":namespace?")
export class VerificationRequestController {
    constructor(
        private verificationRequestService: VerificationRequestService,
        private configService: ConfigService,
        private viewService: ViewService,
        private reviewTaskService: ReviewTaskService
    ) {}

    @ApiTags("verification-request")
    @Get("api/verification-request")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async listAll(@Query() getVerificationRequest) {
        const { pageSize, page } = getVerificationRequest;

        return Promise.all([
            this.verificationRequestService.listAll(getVerificationRequest),
            this.verificationRequestService.count({}),
        ]).then(([verificationRequests, totalVerificationRequests]) => {
            const totalPages = Math.ceil(totalVerificationRequests / pageSize);

            return {
                verificationRequests,
                totalVerificationRequests,
                totalPages,
                page: page,
                pageSize: pageSize,
            };
        });
    }

    @ApiTags("verification-request")
    @Get("api/verification-request/search")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getAll(@Query() getVerificationRequest) {
        return this.verificationRequestService.findAll(getVerificationRequest);
    }

    @ApiTags("verification-request")
    @Get("api/verification-request/:id")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async getById(@Param("id") verificationRequestId: string) {
        return this.verificationRequestService.getById(verificationRequestId);
    }

    @ApiTags("verification-request")
    @Post("api/verification-request")
    create(@Body() verificationRequestBody: CreateVerificationRequestDTO) {
        return this.verificationRequestService.create(verificationRequestBody);
    }

    @ApiTags("verification-request")
    @Put("api/verification-request/:verificationRequestId")
    async updateVerificationRequest(
        @Param("verificationRequestId") verificationRequestId: string,
        @Body() updateVerificationRequestDto: UpdateVerificationRequestDTO
    ) {
        return this.verificationRequestService.update(
            verificationRequestId,
            updateVerificationRequestDto
        );
    }

    @ApiTags("verification-request")
    @Put("api/verification-request/:verificationRequestId/group")
    async removeVerificationRequestFromGroup(
        @Param("verificationRequestId") verificationRequestId: string,
        @Body() { group }: { group: string }
    ) {
        return this.verificationRequestService.removeVerificationRequestFromGroup(
            verificationRequestId,
            group
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("verification-request")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async verificationRequestPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        await this.viewService.getNextServer().render(
            req,
            res,
            "/verification-request-page",
            Object.assign(parsedUrl.query, {
                nameSpace: req.params.namespace,
            })
        );
    }

    @IsPublic()
    @ApiTags("pages")
    @Get("verification-request/:dataHash")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async verificationRequestReviewPage(
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);
        const { dataHash } = req.params;

        const verificationRequest =
            await this.verificationRequestService.findByDataHash(dataHash);

        const reviewTask =
            await this.reviewTaskService.getReviewTaskByDataHashWithUsernames(
                dataHash
            );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/verification-request-review-page",
            Object.assign(parsedUrl.query, {
                reviewTask,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
                hideDescriptions: {},
                websocketUrl: this.configService.get<string>("websocketUrl"),
                nameSpace: req.params.namespace,
                verificationRequest,
            })
        );
    }
}
