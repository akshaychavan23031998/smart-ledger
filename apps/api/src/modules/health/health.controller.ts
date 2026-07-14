import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
  uptimeSeconds: number;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Check whether the API process is running',
  })
  @ApiOkResponse({
    description: 'The API is running normally.',
    schema: {
      example: {
        status: 'ok',
        service: 'smart-ledger-api',
        timestamp: '2026-07-14T16:30:00.000Z',
        uptimeSeconds: 120,
      },
    },
  })
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'smart-ledger-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
