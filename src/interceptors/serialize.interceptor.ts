import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('before request: ', context);

    return next.handle().pipe(
      map((data) => {
        console.log('before response: ', data);
        return data;
      }),
    );
  }
}
