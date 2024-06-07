import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appInitConfig } from './config/init';
import { AllExceptionsFilter } from './config/app-all-exceptions-filter';
import { AppResponseInterceptor } from './config/app-response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  appInitConfig();
  const port: string = process.env.PORT ?? '3000';
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new AppResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  await app.listen(port);
  
  console.log(`[APP] running in port ${port}`);
}
bootstrap();
