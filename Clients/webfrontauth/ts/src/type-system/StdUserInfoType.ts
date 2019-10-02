import { IUserInfoType, StdKeyType } from './type-system.model';
import { IUserInfo, IUserSchemeInfo } from '../authService.model.public';
import { StdUserInfo } from './StdUserInfo';
import { StdUserSchemeInfo } from './StdUserSchemeInfo';
import { IResponseScheme } from '../authService.model.private';

export class StdUserInfoType implements IUserInfoType<IUserInfo> {

    public get anonymous(): IUserInfo {
        return this.createAnonymous();
    }

    public create( userId: number, userName: string, schemes: IUserSchemeInfo[] = null ) {
        return new StdUserInfo( userId, userName, schemes );
    }

    public fromJson( o: object ): IUserInfo {
        if( !o ) { return null; }
        try {
            const userId = Number.parseInt( o[ StdKeyType.userId ] );
            if( userId === 0 ) { return this.anonymous; }
            const userName = o[ StdKeyType.userName ] as string;
            const schemes: IUserSchemeInfo[] = [];
            const jsonSchemes = o[ StdKeyType.schemes ] as IResponseScheme[];
            jsonSchemes.forEach( p => schemes.push( new StdUserSchemeInfo( p[ 'name' ], p['lastUsed'] ) ) );
            return new StdUserInfo( userId, userName, schemes );
        } catch( error ) {
            throw new Error( error );
        }
    }

    protected createAnonymous(): IUserInfo {
        return new StdUserInfo( 0, null, null );
    }
}
