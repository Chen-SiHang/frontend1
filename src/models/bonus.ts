import { getCookie } from '@utils/cookie';
import { GoodDate } from '@utils/datetime';
import { errorBadRequest, errorForbidden, errorNotFound } from '@utils/error-msg';
import { Admin } from './user';

// 加分类型枚举
export enum BonusType {
    DailyBehavior, // 日常行为分
    PersonalDevelopment // 个性发展分
}

const BonusTypeString = ['日常行为分', '个性发展分'];

// 加分条状态枚举
export enum BonusStatus {
    Pending,  // 待审核
    Approved, // 已通过
    Rejected  // 已拒绝
}

const BonusStatusString = ['待审核', '已通过', '已拒绝'];

export class Bonus {
    id: string;
    title: string;
    description: string;
    type: BonusType;
    points: number;
    activityId: string;
    createdBy: string; // 创建者ID (管理员)
    createdAt: GoodDate;
    updatedAt: GoodDate;
    status: BonusStatus;
    studentIds: string[]; // 获得加分的学生ID列表

    constructor(
        id: string,
        title: string,
        description: string,
        type: BonusType,
        points: number,
        activityId: string,
        createdBy: string,
        createdAt: string | GoodDate,
        updatedAt: string | GoodDate,
        status: BonusStatus,
        studentIds: string[]
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.points = points;
        this.activityId = activityId;
        this.createdBy = createdBy;
        this.createdAt = typeof createdAt === 'string' ? GoodDate.fromString(createdAt) : createdAt;
        this.updatedAt = typeof updatedAt === 'string' ? GoodDate.fromString(updatedAt) : updatedAt;
        this.status = status;
        this.studentIds = studentIds;
    }

    typeString(): string {
        return BonusTypeString[this.type];
    }

    statusString(): string {
        return BonusStatusString[this.status];
    }

    static fromJSON(json: any): Bonus {
        return new Bonus(
            json.id,
            json.title,
            json.description,
            json.type,
            json.points,
            json.activityId,
            json.createdBy,
            json.createdAt,
            json.updatedAt,
            json.status,
            json.studentIds
        );
    }

    static fromJSONList(json: any): Bonus[] {
        return json.map((item: any) => Bonus.fromJSON(item));
    }

    static template = new Bonus(
        '',
        '',
        '',
        BonusType.DailyBehavior,
        0,
        '',
        '',
        new GoodDate(),
        new GoodDate(),
        BonusStatus.Pending,
        []
    );

    // 获取加分条列表
    static listBonus = async (
        limit: number,
        offset: number,
        type?: BonusType,
        status?: BonusStatus,
        props: { serverEndpoint?: string } = {}
    ) => {
        let url = `${props.serverEndpoint}/bonus?limit=${limit}&offset=${offset}`;
        
        if (type !== undefined) {
            url += `&type=${type}`;
        }
        
        if (status !== undefined) {
            url += `&status=${status}`;
        }
        
        const response = await fetch(url, {
            headers: {
                Authorization: getCookie('token') || '',
            },
        });
        
        const json = await response.json();
        
        if (response.ok) {
            return Bonus.fromJSONList(json);
        } else if (response.status === 400) {
            throw new Error(errorBadRequest);
        } else if (response.status === 403) {
            throw new Error(errorForbidden);
        } else {
            throw new Error(json.error);
        }
    };

    // 获取单个加分条详情
    static getBonus = async (id: string, props: { serverEndpoint?: string } = {}) => {
        const response = await fetch(`${props.serverEndpoint}/bonus/${id}`, {
            headers: {
                Authorization: getCookie('token') || '',
            },
        });
        
        const json = await response.json();
        
        if (response.ok) {
            return Bonus.fromJSON(json);
        } else if (response.status === 404) {
            throw new Error(errorNotFound);
        } else {
            throw new Error(json.error);
        }
    };

    // 创建加分条（仅管理员可用）
    static createBonus = async (
        data: {
            title: string;
            description: string;
            type: BonusType;
            points: number;
            activityId: string;
            studentIds: string[];
        },
        props: { serverEndpoint?: string } = {}
    ) => {
        const response = await fetch(`${props.serverEndpoint}/bonus/new`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getCookie('token') || '',
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();

        if (response.ok) {
            return Bonus.fromJSON(json.data);
        } else if (response.status === 403) {
            throw new Error(errorForbidden);
        } else {
            throw new Error(json.error);
        }
    };

    // 更新加分条
    static updateBonus = async (
        id: string,
        data: {
            title?: string;
            description?: string;
            type?: BonusType;
            points?: number;
            activityId?: string;
            status?: BonusStatus;
            studentIds?: string[];
        },
        props: { serverEndpoint?: string } = {}
    ) => {
        const response = await fetch(`${props.serverEndpoint}/bonus/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getCookie('token') || '',
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();

        if (response.ok) {
            return Bonus.fromJSON(json.data);
        } else if (response.status === 400) {
            throw new Error(errorBadRequest);
        } else if (response.status === 403) {
            throw new Error(errorForbidden);
        } else if (response.status === 404) {
            throw new Error(errorNotFound);
        } else {
            throw new Error(json.error);
        }
    };

    // 删除加分条
    static deleteBonus = async (id: string, props: { serverEndpoint?: string } = {}) => {
        const response = await fetch(`${props.serverEndpoint}/bonus/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: getCookie('token') || '',
            },
        });

        if (response.ok) {
            return true;
        } else if (response.status === 403) {
            throw new Error(errorForbidden);
        } else if (response.status === 404) {
            throw new Error(errorNotFound);
        } else {
            const json = await response.json();
            throw new Error(json.error);
        }
    };

    // 批量导入加分条
    static importBonus = async (
        data: {
            bonusList: {
                title: string;
                description: string;
                type: BonusType;
                points: number;
                activityId: string;
                studentIds: string[];
            }[];
        },
        props: { serverEndpoint?: string } = {}
    ) => {
        const response = await fetch(`${props.serverEndpoint}/bonus/import`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getCookie('token') || '',
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();

        if (response.ok) {
            return json;
        } else if (response.status === 400) {
            throw new Error(errorBadRequest);
        } else if (response.status === 403) {
            throw new Error(errorForbidden);
        } else {
            throw new Error(json.error);
        }
    };

    // 获取学生的加分记录
    static getStudentBonus = async (
        studentId: string, 
        limit: number, 
        offset: number,
        type?: BonusType,
        props: { serverEndpoint?: string } = {}
    ) => {
        let url = `${props.serverEndpoint}/bonus/student/${studentId}?limit=${limit}&offset=${offset}`;
        
        if (type !== undefined) {
            url += `&type=${type}`;
        }
        
        const response = await fetch(url, {
            headers: {
                Authorization: getCookie('token') || '',
            },
        });
        
        const json = await response.json();
        
        if (response.ok) {
            return Bonus.fromJSONList(json);
        } else if (response.status === 404) {
            throw new Error(errorNotFound);
        } else {
            throw new Error(json.error);
        }
    };

    // 审核加分条
    static reviewBonus = async (
        id: string,
        status: BonusStatus,
        comment?: string,
        props: { serverEndpoint?: string } = {}
    ) => {
        const response = await fetch(`${props.serverEndpoint}/bonus/review/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getCookie('token') || '',
            },
            body: JSON.stringify({ status, comment }),
        });

        const json = await response.json();

        if (response.ok) {
            return Bonus.fromJSON(json.data);
        } else if (response.status === 400) {
            throw new Error(errorBadRequest);
        } else if (response.status === 403) {
            throw new Error(errorForbidden);
        } else if (response.status === 404) {
            throw new Error(errorNotFound);
        } else {
            throw new Error(json.error);
        }
    };
}

// 加分统计类
export class BonusStatistics {
    studentId: string;
    totalDailyBehaviorPoints: number;
    totalPersonalDevelopmentPoints: number;
    totalPoints: number;

    constructor(
        studentId: string,
        totalDailyBehaviorPoints: number,
        totalPersonalDevelopmentPoints: number
    ) {
        this.studentId = studentId;
        this.totalDailyBehaviorPoints = totalDailyBehaviorPoints;
        this.totalPersonalDevelopmentPoints = totalPersonalDevelopmentPoints;
        this.totalPoints = totalDailyBehaviorPoints + totalPersonalDevelopmentPoints;
    }

    static fromJSON(json: any): BonusStatistics {
        return new BonusStatistics(
            json.studentId,
            json.totalDailyBehaviorPoints,
            json.totalPersonalDevelopmentPoints
        );
    }

    // 获取学生加分统计
    static getStudentStatistics = async (
        studentId: string,
        props: { serverEndpoint?: string } = {}
    ) => {
        const response = await fetch(`${props.serverEndpoint}/bonus/statistics/${studentId}`, {
            headers: {
                Authorization: getCookie('token') || '',
            },
        });
        
        const json = await response.json();
        
        if (response.ok) {
            return BonusStatistics.fromJSON(json);
        } else if (response.status === 404) {
            throw new Error(errorNotFound);
        } else {
            throw new Error(json.error);
        }
    };
} 