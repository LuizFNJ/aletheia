import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Roles } from "../../auth/ability/ability.factory";

@Injectable()
export default class OryService {
    private adminUrl: string;
    constructor(private configService: ConfigService) {
        const { admin_url, admin_endpoint } = this.configService.get("ory");

        this.adminUrl = `${admin_url}/${admin_endpoint}`;
    }

    async updateIdentity(user, password, role): Promise<any> {
        const { access_token: token, schema_id } =
            this.configService.get("ory");
        const credentials = password
            ? {
                  password: {
                      config: { password },
                  },
              }
            : {};
        return fetch(`${this.adminUrl}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role,
                },
                credentials,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async updateUserState(user, state): Promise<any> {
        const { access_token: token, schema_id } =
            this.configService.get("ory");

        return fetch(`${this.adminUrl}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                state,
                traits: {
                    email: user.email,
                    user_id: user._id,
                },
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async updateUserRole(user, role): Promise<any> {
        const { access_token: token, schema_id } =
            this.configService.get("ory");

        return await fetch(`${this.adminUrl}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                //When updating any traits, the user_id and email traits are required.
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role,
                },
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async createIdentity(user, password, role?): Promise<any> {
        const { access_token: token, schema_id } =
            this.configService.get("ory");
        return fetch(`${this.adminUrl}/identities`, {
            method: "post",
            body: JSON.stringify({
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role: role || { main: Roles.Regular },
                },
                credentials: {
                    password: {
                        config: { password },
                    },
                },
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "omit",
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        });
    }

    deleteIdentity(identityId): Promise<any> {
        const { access_token: token } = this.configService.get("ory");
        return fetch(`${this.adminUrl}/identities/${identityId}`, {
            method: "delete",
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}
